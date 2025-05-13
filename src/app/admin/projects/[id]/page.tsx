// app/edit/[id]/page.tsx
"use client";

import { getProjectById } from "@/app/actions/projects/get";
import { updateProject } from "@/app/actions/projects/update";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { Inputs, PhotoItem } from "../types";

function mapUrlsToPhotoItems(urls: string[]): PhotoItem[] {
  return urls.map((url) => ({
    id: crypto.randomUUID(),
    url,
    file: undefined,
  }));
}

export default function EditProjectPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<Inputs | null>(null);
  const [initialPhotos, setInitialPhotos] = useState<PhotoItem[]>([]);
  const [initialBlueprints, setInitialBlueprints] = useState<PhotoItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProjectById(id as string);

      if (!data) return;
      setInitialData(data as any);
      setInitialPhotos(mapUrlsToPhotoItems(data.photos));
      setInitialBlueprints(mapUrlsToPhotoItems(data.blueprints));
    };
    loadData();
  }, [id]);

  const handleUpdate = async (
    formData: Inputs,
    newPhotos: PhotoItem[],
    newBlueprints: PhotoItem[]
  ) => {
    await updateProject(formData, newPhotos, newBlueprints, id as string);
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <ProjectForm
      onSubmit={handleUpdate}
      defaultValues={initialData}
      initialPhotos={initialPhotos}
      initialBlueprints={initialBlueprints}
      isEdit
    />
  );
}
