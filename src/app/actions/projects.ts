import { supabase } from "@/utils/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { title } from "process";

export async function addProjects(data: any) {
  console.log(data);
  // Checks for user auth
  // Checks data validation
  // Store project in database
  // Redirect user
  const response = await supabase.from("projects").insert({
    title: data.title,
  });
  console.log(response);
}

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select(`
			id,
			title
	`);

  if (error?.code) {
    return [];
  }

  return data || [];
}

export async function getProject() {}

export async function updateProject() {}

export async function removeProject() {}

type Project = {
  id: string;
  title: string;
};
