"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { JournalEntry } from "./type";
import { deleteFiles, storeFiles } from "../files";
import { getFullPathPhoto } from "@/utils/general";


type UpdateJournalEntryData = Partial<JournalEntry> & {
  photo?: File | string | null;
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

    if (!existingJournalEntry) {
      throw new Error("Journal entry not found");
    }

    let nextPhoto = existingJournalEntry.photo;

    if (data.photo instanceof File) {
      const storedPhotoUrls = await storeFiles([data.photo], "journal_photos");
      nextPhoto = storedPhotoUrls[0];
    } else if (typeof data.photo === "string") {
      nextPhoto = getFullPathPhoto(data.photo);
    }

    const { error } = await supabaseAdmin
      .from("journal")
      .update({ ...data, photo: nextPhoto })
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (
      data.photo instanceof File &&
      existingJournalEntry.photo &&
      nextPhoto &&
      existingJournalEntry.photo !== nextPhoto
    ) {
      await deleteFiles([existingJournalEntry.photo]);
    }

    revalidatePath("/journal");
    revalidatePath("/admin/journal");
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
