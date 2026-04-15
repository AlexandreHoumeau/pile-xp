"use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { JournalEntry } from "./type";
import { getPublicUrl } from "@/utils/general";

export const listJournals = async (): Promise<JournalEntry[] | null> => {
  const { data, error } = await supabaseAdmin
    .from("journal")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching journal entries:", error.message);
    throw new Error("Failed to fetch journal entries");
  }

  return (
    data?.map((journal) => ({
      ...journal,
      photo: getPublicUrl([journal.photo])[0] ?? null,
    })) || null
  );
};
