"use server";

import { supabaseAdmin as supabase } from "@/utils/supabaseAdmin"
import { AboutSection } from "./get";
import { storeFiles } from "../files";
import { getPublicUrl } from "@/utils/general";

export async function addAboutInfo(
  sections: AboutSection[],
  photos: (File | string)[],
) {
  console.log({ sections, photos });
  const newFiles = photos.filter((p) => p instanceof File) as File[];
  const keptUrls = photos.filter((p) => typeof p === "string") as string[];

  const uploadedPaths = newFiles.length > 0 ? await storeFiles(newFiles, "about") : []; 
  const uploadedUrls = getPublicUrl(uploadedPaths);

  const finalPhotos = [...keptUrls, ...uploadedUrls].filter(Boolean);

  const { data: aboutData, error: aboutError } = await supabase
    .from("about_info")
    .insert({ photos: finalPhotos })
    .select("id")
    .maybeSingle();

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

  return { success: true, id: aboutId, photos: finalPhotos };
}
