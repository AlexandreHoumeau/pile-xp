import { FAQItem } from "@/app/admin/contact/page";
import { supabase } from "@/utils/supabaseClient";

export const updateFAQ = async (newFAQs: FAQItem[]): Promise<void> => {
	await supabase.from("FAQ").delete().neq("id", 0);

	await supabase
		.from('FAQ')
		.insert(newFAQs.map(({ question, answer }) => ({ question, answer })))
};
