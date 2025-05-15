import { supabase } from "@/utils/supabaseClient";
import { deleteFiles } from "./files";

export async function deleteProjectById(id: string) {
  try {
    // Get project photos and blueprints
    const { data: exisitingProject } = await supabase
      .from("projects")
      .select("photos, blueprints")
      .eq("id", id)
      .single();

    // Delete project photos and blueprints
    deleteFiles(exisitingProject?.photos, "photos");
    deleteFiles(exisitingProject?.blueprints, "blueprints");

    // Delete project
    await supabase.from("projects").delete().eq("id", id);
  } catch (error) {
    throw error;
  }
}
