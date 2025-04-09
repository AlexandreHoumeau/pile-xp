import { supabase } from "@/utils/supabaseClient";

export async function storeFiles(files: File[], folder: string) {
  const fileUrls = [];

  for (const file of files) {
    const filePath = `${folder}/${crypto.randomUUID()}-${file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}`;

    const { data, error } = await supabase.storage
      .from("projects")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    if (data) {
      fileUrls.push(data.fullPath);
    }
  }

  return fileUrls;
}
