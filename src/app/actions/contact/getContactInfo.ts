"use server";

import { listFAQ } from "./listFAQ";
import type { ContactInfo } from "./type";
import { supabase } from "@/utils/supabaseClient";
import { normalizeStoragePath } from "@/utils/general";

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
