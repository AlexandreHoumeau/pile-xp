"user server";

import { supabase } from "@/utils/supabaseClient";
import { JournalEntry } from "./type";
import { deleteFiles, storeFiles } from "../files";

type UpdateJournalEntryData = Partial<JournalEntry> & {
  photo?: File | string;
};

export async function updateJournalEntryById(
  id: string,
  data: UpdateJournalEntryData
): Promise<void> {
  try {

    const { data: existingJournalEntry } = await supabase
      .from("journal")
      .select("photo")
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

    const { error } = await supabase.from("journal").update(data).eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
