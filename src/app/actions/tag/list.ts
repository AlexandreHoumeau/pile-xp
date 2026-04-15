import { supabase } from "@/utils/supabaseClient";

export const listTags = async (): Promise<string[] | null> => {
  const { data, error } = await supabase
    .from("projects")
    .select("program")
    .not("program", "is", null);

  if (error) {
    throw error;
  }

  const tags = Array.from(
    new Set(
      (data ?? [])
        .flatMap((project) => project.program ?? [])
        .map((tag) => tag?.trim().toLowerCase())
        .filter((tag): tag is string => Boolean(tag))
    )
  ).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));

  return tags;
};

