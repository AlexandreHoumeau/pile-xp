import { supabase } from "@/utils/supabaseClient";
import { getPublicUrl } from "../files";
import { JournalEntry } from "./type";

export const listJournals = async (): Promise<JournalEntry[] | null> => {
  const { data } = await supabase.from("journal").select();

  return (
    data?.map((journal) => ({
      ...journal,
      photo: getPublicUrl([journal.photo]),
    })) || null
  );
};
