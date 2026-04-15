 "use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { deleteFiles } from "../files";

export async function deleteJournalEntryById(id: string) {
  try {
    // Get project photos and blueprints
    const { data: existingJournalEntry } = await supabaseAdmin
      .from("journal")
      .select("photo")
      .eq("id", id)
      .single();


    // Delete project photos and blueprints
    await deleteFiles([existingJournalEntry?.photo]);

    // // Delete project
    await supabaseAdmin.from("journal").delete().eq("id", id);

    revalidatePath("/journal");
    revalidatePath("/admin/journal");
  } catch (error) {
    throw error;
  }
}
