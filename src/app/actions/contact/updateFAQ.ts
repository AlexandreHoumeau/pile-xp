 "use server";

import type { FAQItem } from "./type";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export const updateFAQ = async (newFAQs: FAQItem[]): Promise<void> => {
	await supabaseAdmin.from("FAQ").delete().neq("id", 0);

	await supabaseAdmin
		.from('FAQ')
		.insert(newFAQs.map(({ question, answer }) => ({ question, answer })))
};
