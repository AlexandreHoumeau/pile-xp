import { supabase } from "@/utils/supabaseClient";
import { Project, ProjectPreview } from "./type";
import { getPublicUrl } from "@/utils/general";

export const listProjects = async (): Promise<Project[] | null> => {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Impossible de charger les projets. Vérifiez la migration display_order.");

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
  const { data, error } = await supabase
    .from("projects")
    .select("photos, title, created_at, id, slug, display_order")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Impossible de charger les projets. Vérifiez la migration display_order.");

  return (
    data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos ?? []),
    })) || null
  );
};


export const listProjectsBySlug = async (): Promise<string[] | []> => {
  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Impossible de charger la navigation des projets.");

  return data?.map(data => data.slug) || [];
};


//list by project tags
export const listProjectsByTag = async (tag: string): Promise<ProjectPreview[] | null> => {
  const { data, error } = await supabase
    .from("projects")
    .select("photos, title, created_at, id, slug, display_order")
    .contains("program", [tag])
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Impossible de charger les projets. Vérifiez la migration display_order.");

  return (
    data?.map((project) => ({
      ...project,
      photos: getPublicUrl(project.photos ?? []),
    })) || null
  );
}
