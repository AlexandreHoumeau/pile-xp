import { supabase } from "@/utils/supabaseClient";
import { Project } from "./type";
import { getPublicUrl } from "@/utils/general";

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


export const listProjectsBySlug = async (): Promise<string[] | []> => {
  const { data } = await supabase.from("projects").select("slug");

  return data?.map(data => data.slug) || [];
};


//list by project tags
export const listProjectsByTag = async (tag: string): Promise<Project[] | null> => {
  const { data } = await supabase.from("projects").select().contains("program", [tag]);

  if (data?.length) {
    data.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos),
      blueprints: getPublicUrl(project.blueprints),
    }));
  }

  return data;
}