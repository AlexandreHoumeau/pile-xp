import { FAQItem } from "@/app/admin/contact/page";
import { listFAQ } from "./listFAQ";
import { supabase } from "@/utils/supabaseClient";

export type ContactInfo = {
	id: string;
	description: string;
	email: string;
	phone_number: string;
	photo_url: string;
	faq: FAQItem[]
}

export const getContactInfo = async (): Promise<ContactInfo | null> => {

	const faq = await listFAQ()

	const { data, error } = await supabase.from("contact_info").select().single()


	return {
		...data,
		faq: faq ?? []
	}
}