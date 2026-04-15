import { getPublicUrl } from "@/utils/general"
import { supabase } from "@/utils/supabaseClient"

export type AboutSection = {
  id: string
  title: string
  description: string
  position: number
}

export type AboutInfo = {
  id: string
  photos: string[]
  sections: AboutSection[]
  footer_text?: string
}

type AboutInfoRow = {
  id: string
  photos: string[] | null
  footer_text?: string | null
}

const isMissingFooterTextColumnError = (
  error: { code?: string; message?: string } | null,
) => {
  const message = error?.message ?? ""

  return (
    error?.code === "PGRST204" ||
    message.includes("about_info.footer_text does not exist") ||
    message.includes("Could not find the 'footer_text' column of 'about_info'")
  )
}

export const getAboutInfo = async (): Promise<AboutInfo | null> => {
  let about: AboutInfoRow | null = null
  let aboutError: { message?: string } | null = null

  const primaryResult = await supabase
    .from("about_info")
    .select("id, photos, footer_text")
    .limit(1)
    .maybeSingle()

  about = primaryResult.data as AboutInfoRow | null
  aboutError = primaryResult.error

  if (isMissingFooterTextColumnError(aboutError)) {
    const fallbackResult = await supabase
      .from("about_info")
      .select("id, photos")
      .limit(1)
      .maybeSingle()

    about = fallbackResult.data as AboutInfoRow | null
    aboutError = fallbackResult.error
  }

  if (aboutError || !about) {
    if (aboutError) {
      console.error("Error fetching about_info:", aboutError.message)
    }
    return null
  }

  // Fetch related sections
  const { data: sections, error: sectionError } = await supabase
    .from("about_sections")
    .select("*")
    .eq("about_id", about.id)
    .order("position", { ascending: true })

  if (sectionError) {
    console.error("Error fetching about_sections:", sectionError.message)
    return null
  }

  return {
    id: about.id,
    photos: getPublicUrl(about.photos ?? []),
    sections: sections ?? [],
    footer_text: about.footer_text ?? undefined,
  }
}

export const getFooterText = async (): Promise<string | null> => {
  const { data, error: aboutError } = await supabase
    .from("about_info")
    .select("footer_text")
    .limit(1)
    .maybeSingle()

  if (isMissingFooterTextColumnError(aboutError)) {
    return null
  }

  if (aboutError || !data) {
    if (aboutError) {
      console.error("Error fetching about_info:", aboutError.message)
    }
    return null
  }

  return data.footer_text || null
}
