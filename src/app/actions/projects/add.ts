import { Inputs } from "@/app/admin/projects/types";
import { supabase } from "@/utils/supabaseClient";
import { storeFiles } from "../files";

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

    const projectData = {
      ...formData,
      pdf_url: storedNewPdfUrl,
      photos: storedPhotoUrls,
      blueprints: storedBlueprintUrls,
    };

    const { error } = await supabase.from("projects").insert([projectData]);

    if (error) {
      throw error;
    }

    return projectData;
  } catch (error) {
    throw error;
  }
}
