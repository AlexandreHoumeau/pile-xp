import { FAQItem } from "@/app/admin/contact/page";
import { listFAQ } from "./listFAQ";
import { supabase } from "@/utils/supabaseClient";
import { normalizeStoragePath } from "@/utils/general";

export type ContactInfo = {
	id: string;
	description: string;
	email: string;
	phone_number: string;
	photo_url: string | null;
	faq: FAQItem[]
}

export const getContactInfo = async (): Promise<ContactInfo | null> => {
	const faq = await listFAQ()
	const { data } = await supabase.from("contact_info").select().single()

	if (!data) {
		return null
	}

	return {
		...data,
		photo_url: normalizeStoragePath(data.photo_url),
		faq: faq ?? []
	}
}
