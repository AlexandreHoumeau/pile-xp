 "use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { deleteFiles } from "../files";

export async function deleteProjectById(id: string) {
  try {
    // Get project photos and blueprints
    const { data: exisitingProject } = await supabaseAdmin
      .from("projects")
      .select("photos, blueprints, pdf_url")
      .eq("id", id)
      .single();

    // Delete project photos and blueprints
    await deleteFiles(exisitingProject?.photos ?? []);
    await deleteFiles(exisitingProject?.blueprints ?? []);
    if (exisitingProject?.pdf_url) {
      await deleteFiles([exisitingProject.pdf_url]);
    }

    // Delete project
    await supabaseAdmin.from("projects").delete().eq("id", id);
  } catch (error) {
    throw error;
  }
}
