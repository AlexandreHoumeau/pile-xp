import { supabase } from "@/utils/supabaseClient"
import { ContactInfo } from "./getContactInfo"
import { updateFAQ } from "./updateFAQ"
import { deleteFiles, storeFiles } from "../files";

export const updateContactInfo = async (
  contact_info: ContactInfo,
  newPhoto?: File | null
): Promise<void> => {
  try {
    let photoUrl = contact_info.photo_url;

    // if a new photo was selected
    if (newPhoto) {
      // remove old photo
      if (photoUrl) {
        const oldPath = photoUrl.split("/").pop();
        if (oldPath) {
					await deleteFiles([oldPath])
        }
      }

      const newPhotoUrl = await storeFiles([newPhoto], "contact_photo")
			photoUrl = newPhotoUrl[0]
    }

    // remove `faq` before insert
    const { faq, ...contactInfoWithoutFaq } = contact_info;

    await supabase.from("contact_info").delete().neq("id", 0);
    await updateFAQ(faq);

    const { error } = await supabase
      .from("contact_info")
      .insert({ ...contactInfoWithoutFaq, photo_url: photoUrl });

    if (error) throw error;
  } catch (error: any) {
    console.error(error);
    throw Error(error.message || "Failed to update contact info");
  }
}
