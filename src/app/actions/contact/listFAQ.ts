"use server";

import type { FAQItem } from "./type";
import { supabase } from "@/utils/supabaseClient";

export const listFAQ = async (): Promise<FAQItem[] | null> => {
  const { data } = await supabase.from("FAQ").select();

  return data
};
