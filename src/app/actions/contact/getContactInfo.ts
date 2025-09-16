import { FAQItem } from "@/app/admin/contact/page";
import { listFAQ } from "./listFAQ";
import { supabase } from "@/utils/supabaseClient";
import { getPublicUrl } from "../files";

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

	const { data } = await supabase.from("contact_info").select().single()


	return {
		...data,
		photo_url: getPublicUrl([data.photo_url])[0],
		faq: faq ?? []
	}
}