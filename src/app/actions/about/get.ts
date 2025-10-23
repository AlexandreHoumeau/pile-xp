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
}

export const getAboutInfo = async (): Promise<AboutInfo | null> => {
  const { data: about, error: aboutError } = await supabase
    .from("about_info")
    .select("*")
    .single()

  console.log(about, aboutError)
  if (aboutError || !about) {
    console.error("Error fetching about_info:", aboutError)
    return null
  }

  // Fetch related sections
  const { data: sections, error: sectionError } = await supabase
    .from("about_sections")
    .select("*")
    .order("position", { ascending: true })

  if (sectionError) {
    console.error("Error fetching about_sections:", sectionError)
    return null
  }

  return {
    id: about.id,
    photos: about.photos ?? [],
    sections: sections ?? [],
  }
}
