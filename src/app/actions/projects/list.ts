import { supabase } from "@/utils/supabaseClient";
import { Project, ProjectPreview } from "./type";
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

export const listProjectsOverview = async (): Promise<ProjectPreview[] | null> => {
  const { data } = await supabase.from("projects").select("photos , title, created_at, id, slug, colaborators");

  if (data?.length) {
    data.map((project) => ({
      ...project,
      photos: getPublicUrl([project.photos[0]]),
    }));
  }

  return data;
};


export const listProjectsBySlug = async (): Promise<string[] | []> => {
  const { data } = await supabase.from("projects").select("slug");

  return data?.map(data => data.slug) || [];
};


//list by project tags
export const listProjectsByTag = async (tag: string): Promise<ProjectPreview[] | null> => {
  const { data } = await supabase.from("projects").select("photos , title, created_at, id, slug, colaborators").contains("program", [tag]);

  if (data?.length) {
    data.map((project) => ({
      ...project,
      photos: getPublicUrl([project.photos[0]]),
    }));
  }

  return data;
}