"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin as supabase } from "@/utils/supabaseAdmin"
import { AboutSection } from "./get";
import { storeFiles } from "../files";
import { getPublicUrl } from "@/utils/general";

const isMissingFooterTextColumnError = (
  error: { code?: string; message?: string } | null,
) => {
  const message = error?.message ?? "";

  return (
    error?.code === "PGRST204" ||
    message.includes("about_info.footer_text does not exist") ||
    message.includes("Could not find the 'footer_text' column of 'about_info'")
  );
};

export async function addAboutInfo(
  footer_text: string | undefined,
  sections: AboutSection[],
  photos: (File | string)[],
) {
  const newFiles = photos.filter((p) => p instanceof File) as File[];
  const keptUrls = photos.filter((p) => typeof p === "string") as string[];

  const uploadedPaths = newFiles.length > 0 ? await storeFiles(newFiles, "about") : [];
  const uploadedUrls = getPublicUrl(uploadedPaths);

  const finalPhotos = [...keptUrls, ...uploadedUrls].filter(Boolean);

  let { data: aboutData, error: aboutError } = await supabase
    .from("about_info")
    .insert({ photos: finalPhotos, footer_text })
    .select("id")
    .maybeSingle();

  if (isMissingFooterTextColumnError(aboutError)) {
    const fallbackResult = await supabase
      .from("about_info")
      .insert({ photos: finalPhotos })
      .select("id")
      .maybeSingle();

    aboutData = fallbackResult.data;
    aboutError = fallbackResult.error;
  }

  if (aboutError) throw aboutError;
  const aboutId = aboutData?.id;

  const { error: sectionError } = await supabase.from("about_sections").insert(
    sections.map((s) => ({
      about_id: aboutId,
      title: s.title,
      description: s.description,
    })),
  );

  if (sectionError) throw sectionError;

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { success: true, id: aboutId, photos: finalPhotos };
}
