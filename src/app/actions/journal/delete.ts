import { supabase } from "@/utils/supabaseClient";
import { deleteFiles, getFullPathPhoto, getPublicUrl } from "../files";

export async function deleteJournalEntryById(id: string) {
  try {
    // Get project photos and blueprints
    const { data: existingJournalEntry } = await supabase
      .from("journal")
      .select("photo")
      .eq("id", id)
      .single();


    // Delete project photos and blueprints
    await deleteFiles([existingJournalEntry?.photo]);

    // // Delete project
    await supabase.from("journal").delete().eq("id", id);
  } catch (error) {
    throw error;
  }
}
