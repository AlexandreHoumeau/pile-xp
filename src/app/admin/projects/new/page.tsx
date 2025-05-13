// app/add/page.tsx
"use client";

import { saveDraft } from "@/app/actions/projects/add";
import ProjectForm from "../components/ProjectForm";
import { Inputs, PhotoItem } from "../types";

export default function AddProject() {
  const handleCreate = async (
    data: Inputs,
    photos: PhotoItem[],
    blueprints: PhotoItem[]
  ) => {
    const photosToStore = photos
      .filter((p) => p.file)
      .map((p) => p.file as File);
    const blueprintsToStore = blueprints
      .filter((b) => b.file)
      .map((b) => b.file as File);

      await saveDraft(data, photosToStore, blueprintsToStore);
  };

  return <ProjectForm onSubmit={handleCreate} />;
}
