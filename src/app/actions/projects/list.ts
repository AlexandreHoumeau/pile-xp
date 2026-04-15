import { supabase } from "@/utils/supabaseClient";
import { Project, ProjectPreview } from "./type";
import { getPublicUrl } from "@/utils/general";

export const listProjects = async (): Promise<Project[] | null> => {
  const { data } = await supabase
    .from("projects")
    .select()
    .order("created_at", { ascending: false });

  return (
    data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos),
      blueprints: getPublicUrl(project.blueprints),
      pdf_url: project.pdf_url ? getPublicUrl([project.pdf_url])[0] : undefined,
    })) || null
  );
};

export const listProjectsOverview = async (): Promise<ProjectPreview[] | null> => {
  const { data } = await supabase
    .from("projects")
    .select("photos, title, created_at, id, slug")
    .order("created_at", { ascending: false });

  return (
    data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos ?? []),
    })) || null
  );
};


export const listProjectsBySlug = async (): Promise<string[] | []> => {
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .order("created_at", { ascending: false });

  return data?.map(data => data.slug) || [];
};


//list by project tags
export const listProjectsByTag = async (tag: string): Promise<ProjectPreview[] | null> => {
  const { data } = await supabase
    .from("projects")
    .select("photos, title, created_at, id, slug")
    .contains("program", [tag])
    .order("created_at", { ascending: false });

  return (
    data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos ?? []),
    })) || null
  );
}
