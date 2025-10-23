"use server";
import { Inputs, PhotoItem } from "@/app/admin/projects/types";
import { deleteFiles, storeFiles } from "../files";
import { getProjectById } from "./get";
import { syncTags } from "../tag/SyncTags";
import { getFullPathPhoto } from "@/utils/general";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function updateProject(
  formData: Inputs,
  photos: PhotoItem[],
  blueprints: PhotoItem[],
  id: string
) {
  try {
    const data = await getProjectById(id);

    const newPhotos: File[] = photos
      .map((photo) => photo.file)
      .filter((file): file is File => file !== undefined);

    const newBlueprints: File[] = blueprints
      .map((photo) => photo.file)
      .filter((file): file is File => file !== undefined);

    const storedPhotoUrls = await storeFiles(newPhotos, "photos");
    const storedBluePrintUrls = await storeFiles(newBlueprints, "blueprints");
    let storedNewPdfUrl: string | null = null;


    if (formData.pdf_url && formData.pdf_url instanceof File) {
      const [pdfUrl] = await storeFiles([formData.pdf_url], "pdfs");
      storedNewPdfUrl = pdfUrl;
    }

    if (formData.pdf_url === null && data?.pdf_url) {
      await deleteFiles([data.pdf_url]);
    }

    // Create a new array of photo with the public url from "photos"
    const newPhotosUrls: string[] = [];
    const newBlueprintUrls: string[] = [];

    photos.forEach((photo) => {
      if (photo.file) {
        newPhotosUrls.push(storedPhotoUrls.shift()!);
      } else {
        newPhotosUrls.push(getFullPathPhoto(photo.url));
      }
    });

    blueprints.forEach((blueprint) => {
      if (blueprint.file) {
        newBlueprintUrls.push(storedBluePrintUrls.shift()!);
      } else {
        newBlueprintUrls.push(getFullPathPhoto(blueprint.url));
      }
    });

    // Find out if there is some deleted photos
    const existingPhotoUrls = new Set(data?.photos);
    const existingBlueprintUrls = new Set(data?.blueprints);

    const deletedPhotoUrls = Array.from(existingPhotoUrls).filter(
      (url) => !newPhotosUrls.includes(getFullPathPhoto(url))
    );

    const deletedBlueprintUrls = Array.from(existingBlueprintUrls).filter(
      (url) => !newBlueprintUrls.includes(url)
    );

    await deleteFiles(deletedPhotoUrls);
    await deleteFiles(deletedBlueprintUrls);

    const projectData = {
      ...formData,
      pdf_url: storedNewPdfUrl ? storedNewPdfUrl : formData.pdf_url === null ? null : data?.pdf_url,
      photos: newPhotosUrls,
      blueprints: newBlueprintUrls,
    };

    const { error } = await supabaseAdmin
      .from("projects")
      .update(projectData)
      .eq("id", id);

    if (error) {
      throw error;
    }

    await syncTags();

  } catch (error) {
    throw error;
  }
}
