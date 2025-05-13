import { supabase } from "@/utils/supabaseClient";
import { Project } from "./type";
import { getPublicUrl } from "./files";

export const getProjectById = async (id: string): Promise<Project | null> => {
  const { data } = await supabase
    .from("projects")
    .select()
    .eq("id", id)
    .limit(1)
    .single();

  if (data) {
    data.photos = getPublicUrl(data.photos);
    data.blueprints = getPublicUrl(data.blueprints);
  }

  return data;
};
