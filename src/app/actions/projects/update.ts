import { Inputs, PhotoItem } from "@/app/admin/projects/types";
import { storeFiles, deleteFiles, URL_SUFFIX, getFullPathPhoto } from "./files";
import { supabase } from "@/utils/supabaseClient";
import { getProjectById } from "./get";

export async function updateProject(
  formData: Inputs,
  photos: PhotoItem[],
  blueprints: PhotoItem[],
  id: string
) {
  try {
    // Get existing project
    const data = await getProjectById(id);

    const newPhotos: File[] = photos
      .map((photo) => photo.file)
      .filter((file): file is File => file !== undefined);

    const newBlueprints: File[] = blueprints
      .map((photo) => photo.file)
      .filter((file): file is File => file !== undefined);

    const storedPhotoUrls = await storeFiles(newPhotos, "photos");
    const storedBluePrintUrls = await storeFiles(newBlueprints, "blueprints");

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

    await deleteFiles(deletedPhotoUrls, "photos");
    await deleteFiles(deletedBlueprintUrls, "blueprints");

    const projectData = {
      ...formData,
      photos: newPhotosUrls,
      blueprints: newBlueprintUrls,
    };

    const { error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
