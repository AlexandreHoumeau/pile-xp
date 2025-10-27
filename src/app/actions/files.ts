"use server";
import { supabase } from "@/utils/supabaseClient";
import { supabaseAdmin } from "@/utils/supabaseAdmin"
import { getFullPathPhoto } from "@/utils/general";

export async function storeFiles(files: File[], folder: string) {
  const fileUrls = [];

  for (const file of files) {
    const filePath = `${folder}/${crypto.randomUUID()}-${file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")}`;

    const { data, error } = await supabaseAdmin.storage
      .from("projects")
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    if (data) {
      fileUrls.push(data.path);
    }
  }

  return fileUrls;
}

export async function deleteFiles(fileUrls: string[]) {
  for (const fileUrl of fileUrls) {
    const { error } = await supabaseAdmin.storage
      .from("projects")
      .remove([getFullPathPhoto(fileUrl)]);

    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export async function emptyFolder(folder: string) {
  const { data: files, error: listError } = await supabase
    .storage
    .from("projects")
    .list(folder, { limit: 1000 }); // adjust limit if needed

  if (listError) throw listError;
  if (!files || files.length === 0) return;

  // Step 2: Build array of paths to delete
  const paths = files.map((file) => `${folder}/${file.name}`);

  // Step 3: Delete them
  const { error: deleteError } = await supabase
    .storage
    .from("projects")
    .remove(paths);

  if (deleteError) throw deleteError;
}
