 "use server";

import { Inputs } from "@/app/admin/projects/types";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { storeFiles } from "../files";
import { syncTags } from "../tag/SyncTags";

export async function saveDraft(
  formData: Inputs,
  photos: File[],
  blueprints: File[]
) {
  try {
    const storedPhotoUrls = await storeFiles(photos, "photos");
    const storedBlueprintUrls = await storeFiles(blueprints, "blueprints");

    let storedNewPdfUrl: string | null = null;

    if (formData.pdf_url && formData.pdf_url instanceof File) {
      const [pdfUrl] = await storeFiles([formData.pdf_url], "pdfs");
      storedNewPdfUrl = pdfUrl;
    }

    const restFormData = { ...formData };
    delete restFormData.colaborators;
    const projectData = {
      ...restFormData,
      pdf_url: storedNewPdfUrl,
      photos: storedPhotoUrls,
      blueprints: storedBlueprintUrls,
    };

    const { error } = await supabaseAdmin.from("projects").insert([projectData]);

    if (error) {
      throw error;
    }

    await syncTags();

    return projectData;
  } catch (error) {
    throw error;
  }
}
