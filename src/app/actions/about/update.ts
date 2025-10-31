"use server";

import { supabaseAdmin as supabase } from "@/utils/supabaseAdmin"
import { AboutSection } from "./get";
import { deleteFiles, storeFiles } from "../files";
import { getPublicUrl } from "@/utils/general";

export async function updateAboutInfo(
  aboutId: string,
  footer_text: string | undefined,
  newSections: AboutSection[],
  newPhotos: (File | string)[],
) {

  const { data: currentAbout, error: fetchError } = await supabase
    .from("about_info")
    .select("photos")
    .eq("id", aboutId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  const currentPhotos: string[] = currentAbout?.photos ?? [];

  const newFiles = newPhotos.filter((p) => p instanceof File) as File[];
  const keptUrls = newPhotos.filter((p) => typeof p === "string") as string[];

  const uploadedPaths = newFiles.length > 0 ? await storeFiles(newFiles, "about") : [];
  const uploadedUrls = getPublicUrl(uploadedPaths);

  const removedPhotos = currentPhotos.filter((url) => !keptUrls.includes(url));

  if (removedPhotos.length > 0) {
    await deleteFiles(removedPhotos);
  }

  const finalPhotos = [...keptUrls, ...uploadedUrls].filter(Boolean);

  const { error: aboutError } = await supabase
    .from("about_info")
    .update({ photos: finalPhotos, footer_text })
    .eq("id", aboutId);

  if (aboutError) throw aboutError;

  const { error: deleteError } = await supabase
    .from("about_sections")
    .delete()
    .in("about_id", [aboutId]);

  if (deleteError) throw deleteError;

  if (newSections.length > 0) {
    const { error: insertError } = await supabase.from("about_sections").insert(
      newSections.map((s) => ({
        about_id: aboutId,
        title: s.title,
        description: s.description,
      })),
    );

    if (insertError) throw insertError;
  }

  return { success: true, photos: finalPhotos };
}
