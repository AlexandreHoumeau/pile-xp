// components/ProjectForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import BlueprintSection from "./BlueprintSection";
import PhotoSection from "./PhotoSection";
import ProjectDetails from "./ProjectDetails";
import UploadButtons from "./UploadButtons";

import { technicalData } from "../technicalData";
import { Inputs, PhotoItem } from "../types";

interface ProjectFormProps {
  onSubmit: (data: Inputs, photos: any[], blueprints: any[]) => Promise<void>;
  defaultValues?: Inputs;
  initialPhotos?: PhotoItem[];
  initialBlueprints?: PhotoItem[];
  isEdit?: boolean;
}

export default function ProjectForm({
  onSubmit,
  defaultValues,
  initialPhotos = [],
  initialBlueprints = [],
  isEdit = false,
}: ProjectFormProps) {
  const [selectedPhotos, setSelectedPhotos] =
    useState<PhotoItem[]>(initialPhotos);
  const [selectedBluePrints, setSelectedBluePrints] =
    useState<PhotoItem[]>(initialBlueprints);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const bluePrintsInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<Inputs>({
    defaultValues,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    if (files?.length) {
      const selectedFiles = mapFilesToPhotoItems(files);
      updateSelectedFiles(name, selectedFiles);
    }
  };

  const mapFilesToPhotoItems = (files: FileList): PhotoItem[] => {
    return Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
  };

  const updateSelectedFiles = (name: string, selectedFiles: PhotoItem[]) => {
    if (name === "photos") {
      const updatedPhotos = [...selectedPhotos, ...selectedFiles];
      setSelectedPhotos(updatedPhotos);
      setValue("photos", updatedPhotos);
    } else {
      const updatedBlueprints = [...selectedBluePrints, ...selectedFiles];
      setSelectedBluePrints(updatedBlueprints);
    }
  };

  const handleDeletePhoto = (id: string, type?: string) => {
    if (type === "blueprint") {
      setSelectedBluePrints((prev) => prev.filter((bp) => bp.id !== id));
    } else {
      setSelectedPhotos((prev) => prev.filter((photo) => photo.id !== id));
    }
  };

  const onSave = async () => {
    toast.promise(
      async () => {
        const formData = getValues();
        await onSubmit(formData, selectedPhotos, selectedBluePrints);
      },
      {
        loading: isEdit ? "Updating..." : "Creating...",
        success: () => {
          router.push("/admin/projects");
          return isEdit ? "Project updated!" : "Project created!";
        },
        error: (err) => err.message || "Something went wrong.",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="font-insitutrial">
      <UploadButtons
        photosInputRef={photosInputRef}
        bluePrintsInputRef={bluePrintsInputRef}
        isValid={isValid}
      />
      <PhotoSection
        selectedPhotos={selectedPhotos}
        setSelectedPhotos={setSelectedPhotos}
        handleDeletePhoto={handleDeletePhoto}
        register={register}
        handleFileChange={handleFileChange}
        photosInputRef={photosInputRef}
      />
      <div className="grid grid-cols-2">
        <ProjectDetails register={register} technicalData={technicalData} />
        <BlueprintSection
          selectedBluePrints={selectedBluePrints}
          register={register}
          handleFileChange={handleFileChange}
          bluePrintsInputRef={bluePrintsInputRef}
          handleDeletePhoto={handleDeletePhoto}
        />
      </div>
    </form>
  );
}
