 "use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin"
import { ContactInfo } from "./getContactInfo"
import { updateFAQ } from "./updateFAQ"
import { deleteFiles, storeFiles } from "../files";
import { getFullPathPhoto } from "@/utils/general";

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
        await deleteFiles([getFullPathPhoto(photoUrl)])
      }

      const newPhotoUrl = await storeFiles([newPhoto], "contact_photo")
      photoUrl = newPhotoUrl[0]
    } else if (!photoUrl && !newPhoto) {
      // if the photo was removed
      const { data: existingContactInfo } = await supabaseAdmin
        .from("contact_info")
        .select("photo_url")
        .neq("id", 0)
        .single();

      if (existingContactInfo?.photo_url) {
        await deleteFiles([existingContactInfo?.photo_url])
      }
    }

    const { faq, ...contactInfoWithoutFaq } = contact_info;

    await supabaseAdmin.from("contact_info").delete().neq("id", 0);
    await updateFAQ(faq);

    const { error } = await supabaseAdmin
      .from("contact_info")
      .insert({ ...contactInfoWithoutFaq, photo_url: photoUrl });

    if (error) throw error;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update contact info");
  }
}
