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
import { Project } from "@/app/actions/projects/type";

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
      setInitialData(projectToInputs(data));
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


const projectToInputs = (project: Project): Inputs => ({
  title: project.title,
  photos: project.photos.map((url, index) => ({
    id: `photo-${index}`,
    url,
  })),
  blueprints: new DataTransfer().files,
  address: project.address,
  project_owner: project.project_owner,
  project_management: project.project_management,
  program: project.program,
  status: project.status,
  delivery: project.delivery,
  surface: project.surface,
  budget: project.budget,
  pdf_url: project.pdf_url,
  youtube_url: project.youtube_url,
  colaborators: project.colaborators,
  description: project.description,
});
