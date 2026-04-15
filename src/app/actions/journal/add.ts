 "use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { storeFiles } from "../files";

type NewJournal = {
  title: string;
  description: string;
  date: Date;
  url?: string;
  photo: File;
};

export const addJournal = async ({
  title,
  description,
  date,
  url,
  photo,
}: NewJournal) => {
  try {
    const storedPhotoUrls = await storeFiles([photo], "journal_photos");

    const { error } = await supabaseAdmin.from("journal").insert([
      {
        title,
        description,
        date,
        url,
        photo: storedPhotoUrls[0],
      },
    ]);

    if (error) {
      throw error;
    }

    revalidatePath("/journal");
    revalidatePath("/admin/journal");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to add journal entry");
  }
};
