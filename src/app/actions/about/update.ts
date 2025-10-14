"use server"

import { supabase } from "@/utils/supabaseClient"
import { AboutSection } from "./get"
import { deleteFiles, getPublicUrl, storeFiles } from "../files"

export async function updateAboutInfo(
    aboutId: string,
    newSections: AboutSection[],
    newPhotos: (File | string)[], // Can be existing URLs or new files
) {
    // 1️⃣ Fetch the current photos
    const { data: currentAbout } = await supabase
        .from("about_info")
        .select("photos")
        .eq("id", aboutId)
        .single()

    const currentPhotos: string[] = currentAbout?.photos ?? []

    // 2️⃣ Split between new files and existing URLs
    const newFiles = newPhotos.filter((p) => p instanceof File) as File[]
    const keptUrls = newPhotos.filter((p) => typeof p === "string") as string[]

    // 3️⃣ Upload new files to Supabase storage
    const uploadedPaths = newFiles.length > 0 ? await storeFiles(newFiles, "about") : []
    const uploadedUrls = getPublicUrl(uploadedPaths)

    // 4️⃣ Delete removed photos from storage
    const removedPhotos = currentPhotos.filter((url) => !keptUrls.includes(url))
    if (removedPhotos.length > 0) {
        await deleteFiles(removedPhotos)
    }

    // 5️⃣ Update the about_info table
    const finalPhotos = [...keptUrls, ...uploadedUrls]
    const { error: aboutError } = await supabase
        .from("about_info")
        .update({ photos: finalPhotos })
        .eq("id", aboutId)

    if (aboutError) throw aboutError

    // 6️⃣ Update sections (simplest way: delete all + reinsert)
    await supabase.from("about_sections").delete().eq("about_id", aboutId)

    const { error: sectionError } = await supabase.from("about_sections").insert(
        newSections.map((s) => ({
            about_id: aboutId,
            title: s.title,
            description: s.description,
        })),
    )

    if (sectionError) throw sectionError

    return { success: true, photos: finalPhotos }
}
