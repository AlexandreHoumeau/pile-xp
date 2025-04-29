import { supabase } from "@/utils/supabaseClient";
import { Project } from "./type";

export const listProjects = async (): Promise<Project[] | null> => {
  const { data } = await supabase.from("projects").select();

  return data;
};
