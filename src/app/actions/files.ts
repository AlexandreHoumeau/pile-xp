"use server";
import { supabase } from "@/utils/supabaseClient";
import { supabaseAdmin } from "@/utils/supabaseAdmin"
import { getFullPathPhoto } from "@/utils/general";

const sanitizeFileName = (fileName: string) => {
  const normalizedName = fileName.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const lastDotIndex = normalizedName.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0;
  const rawBaseName = hasExtension ? normalizedName.slice(0, lastDotIndex) : normalizedName;
  const rawExtension = hasExtension ? normalizedName.slice(lastDotIndex + 1) : "";

  const baseName = rawBaseName
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";

  const extension = rawExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return extension ? `${baseName}.${extension}` : baseName;
};

export async function storeFiles(files: File[], folder: string) {
  const fileUrls = [];

  for (const file of files) {
    const filePath = `${folder}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;

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
  const paths = Array.from(
    new Set(
      fileUrls
        .map((fileUrl) => getFullPathPhoto(fileUrl))
        .filter(Boolean)
    )
  );

  if (paths.length === 0) {
    return;
  }

  const { error } = await supabaseAdmin.storage
    .from("projects")
    .remove(paths);

  if (error) {
    console.error("Error deleting files:", error);
    throw error;
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
