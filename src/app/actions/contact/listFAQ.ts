import { FAQItem } from "@/app/admin/contact/page";
import { supabase } from "@/utils/supabaseClient";

export const listFAQ = async (): Promise<FAQItem[] | null> => {
  const { data } = await supabase.from("FAQ").select();

  return data
};
