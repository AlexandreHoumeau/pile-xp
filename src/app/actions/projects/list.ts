import { supabase } from "@/utils/supabaseClient";
import { Project } from "./type";
import { getPublicUrl } from "./files";

export const listProjects = async (): Promise<Project[] | null> => {
  const { data } = await supabase.from("projects").select();

  if (data?.length) {
    data.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos),
      blueprints: getPublicUrl(project.blueprints),
    }));
  }

  return data;
};
