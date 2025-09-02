import { supabase } from "@/utils/supabaseClient"
import { ContactInfo } from "./getContactInfo"
import { updateFAQ } from "./updateFAQ"

export const updateContactInfo = async (contact_info: ContactInfo): Promise<void> => {
	try {
		const { faq, ...contactInfoData } = contact_info

		if (contact_info.faq) {
			await updateFAQ(contact_info.faq)
		}

		const { error: deleteError } = await supabase
			.from("contact_info")
			.delete()
			.neq("id", 0)

		if (deleteError) {
			throw new Error(`Failed to clear contact_info: ${deleteError.message}`)
		}

		const { error: insertError } = await supabase
			.from("contact_info")
			.insert(contactInfoData)

		if (insertError) {
			throw new Error(`Failed to insert contact_info: ${insertError.message}`)
		}
	} catch (err: any) {
		console.error("updateContactInfo error:", err)
		throw err // let the frontend catch and display
	}
}
