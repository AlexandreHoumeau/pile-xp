import { supabase } from "@/utils/supabaseClient";
import { getPublicUrl } from "../files";

export const listJournals = async (): Promise<any[] | null> => {
  const { data } = await supabase.from("journal").select();

  return (
    data?.map((journal) => ({
      ...journal,
      photo: getPublicUrl([journal.photo]),
    })) || null
  );
};
