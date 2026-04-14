 "use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { deleteFiles } from "../files";

export async function deleteProjectById(id: string) {
  try {
    // Get project photos and blueprints
    const { data: exisitingProject } = await supabaseAdmin
      .from("projects")
      .select("photos, blueprints")
      .eq("id", id)
      .single();

    // Delete project photos and blueprints
    deleteFiles(exisitingProject?.photos);
    deleteFiles(exisitingProject?.blueprints);

    // Delete project
    await supabaseAdmin.from("projects").delete().eq("id", id);
  } catch (error) {
    throw error;
  }
}
