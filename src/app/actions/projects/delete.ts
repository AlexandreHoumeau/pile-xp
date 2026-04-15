 "use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { deleteFiles } from "../files";
import { syncTags } from "../tag/SyncTags";

export async function deleteProjectById(id: string) {
  try {
    const { data: existingProject, error: fetchError } = await supabaseAdmin
      .from("projects")
      .select("photos, blueprints, pdf_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingProject) {
      throw new Error("Project not found.");
    }

    await deleteFiles(existingProject.photos ?? []);
    await deleteFiles(existingProject.blueprints ?? []);

    if (existingProject.pdf_url) {
      await deleteFiles([existingProject.pdf_url]);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    await syncTags();
  } catch (error) {
    throw error;
  }
}
