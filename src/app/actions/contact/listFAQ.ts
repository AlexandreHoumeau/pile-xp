import { supabase } from "@/utils/supabaseClient";

export const listFAQ = async (): Promise<any[] | null> => {
  const { data } = await supabase.from("FAQ").select();

  return data
};
