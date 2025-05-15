// app/edit/[id]/page.tsx
"use client";

import { getProjectById } from "@/app/actions/projects/get";
import { updateProject } from "@/app/actions/projects/update";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { Inputs, PhotoItem } from "../types";
import { deleteProjectById } from "@/app/actions/projects/delete";
import toast from "react-hot-toast";

function mapUrlsToPhotoItems(urls: string[]): PhotoItem[] {
  return urls.map((url) => ({
    id: crypto.randomUUID(),
    url,
    file: undefined,
  }));
}

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
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

  const onDelete = () => {
    toast.promise(
      async () => {
        await deleteProjectById(id as string);
      },
      {
        loading: "Deleting..",
        success: () => {
          router.push("/admin/projects");
          return "Project deleted!";
        },
        error: (err) => err.message || "Something went wrong.",
      }
    );
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <ProjectForm
      onSubmit={handleUpdate}
      defaultValues={initialData}
      initialPhotos={initialPhotos}
      initialBlueprints={initialBlueprints}
      isEdit
      onDelete={onDelete}
    />
  );
}
