import { supabase } from "@/utils/supabaseClient";
import { JournalEntry } from "./type";
import { getPublicUrl } from "@/utils/general";

export const listJournals = async (): Promise<JournalEntry[] | null> => {
  const { data } = await supabase.from("journal").select();

  return (
    data?.map((journal) => ({
      ...journal,
      photo: getPublicUrl([journal.photo]),
    })) || null
  );
};
