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

    const projectData = {
      ...formData,
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
