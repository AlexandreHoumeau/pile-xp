import { supabase } from "@/utils/supabaseClient";
import { storeFiles } from "../files";

type NewJournal = {
  title: string;
  description: string;
  date: Date;
  photo: File;
};

export const addJournal = async ({
  title,
  description,
  date,
  photo,
}: NewJournal) => {
  try {
    const storedPhotoUrls = await storeFiles([photo], "journal_photos");

    const { error } = await supabase.from("journal").insert([
      {
        title,
        description,
        date,
        photo: storedPhotoUrls[0],
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to add journal entry");
  }
};
