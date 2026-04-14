"use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { JournalEntry } from "./type";
import { deleteFiles, storeFiles } from "../files";
import { getFullPathPhoto } from "@/utils/general";


type UpdateJournalEntryData = Partial<JournalEntry> & {
  photo?: File | string;
};

export async function updateJournalEntryById(
  id: string,
  data: UpdateJournalEntryData
): Promise<void> {
  try {
    const { data: existingJournalEntry } = await supabaseAdmin
      .from("journal")
      .select("*")
      .eq("id", id)
      .single();

    if (typeof data.photo !== "string") {
      await deleteFiles([existingJournalEntry?.photo]);
      const storedPhotoUrls = await storeFiles([data.photo!], "journal_photos");
      data = {
        ...data,
        photo: storedPhotoUrls[0]
      }
    }

    const { error } = await supabaseAdmin.from("journal").update({ ...data, photo: getFullPathPhoto(data.photo! as string) }).eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
