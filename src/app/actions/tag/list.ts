import { supabase } from "@/utils/supabaseClient";

export const listTags = async (): Promise<string[] | null> => {
  const { data } = await supabase.from("tags").select();

  return data?.map((tag) => tag.name) || null;
};

