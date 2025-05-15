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
import { MAX_FILE_SIZE } from "@/utils/general";
import Modal from "@/components/Modal";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";

interface ProjectFormProps {
  onSubmit: (data: Inputs, photos: any[], blueprints: any[]) => Promise<void>;
  defaultValues?: Inputs;
  initialPhotos?: PhotoItem[];
  initialBlueprints?: PhotoItem[];
  isEdit?: boolean;
  onDelete?: () => void;
}

export default function ProjectForm({
  onSubmit,
  defaultValues,
  initialPhotos = [],
  initialBlueprints = [],
  isEdit = false,
  onDelete,
}: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      const isOneFileBiggerThan2mb = Array.from(files).some(
        (file) => file.size > MAX_FILE_SIZE
      );

      if (isOneFileBiggerThan2mb)
        return toast.error("One or more file(s) are bigger than 2mb.");

      const selectedFiles = mapFilesToPhotoItems(files);
      updateSelectedFiles(name, selectedFiles);
    }
  };

  const mapFilesToPhotoItems = (files: FileList): PhotoItem[] =>
    Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));
  
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
    <>
      <form onSubmit={handleSubmit(onSave)} className="font-insitutrial">
        <UploadButtons
          photosInputRef={photosInputRef}
          bluePrintsInputRef={bluePrintsInputRef}
          isValid={isValid}
          isEdit={isEdit}
          onDelete={() => setIsOpen(true)}
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

      <Modal isOpen={isOpen && isEdit} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-insitutrial_bold mb-2">
          Êtes vous sur de vouloir supprimer ce projet ?
        </h2>
        <p className="text-center italic font-insitutrial mb-2">
          Attention cette action est irréversible.
        </p>
        <div className="flex mt-4 justify-between">
          <AdminIconButton
            label="Annuler"
            onClick={() => setIsOpen(false)}
            className="text-center min-h-max rounded-lg border hover:bg-gray-100"
          />
          <AdminIconButton
            label="Supprimer"
            onClick={onDelete}
            className="text-red-500 text-center min-h-max rounded-lg hover:bg-red-200 bg-red-100 border border-red-200"
          />
        </div>
      </Modal>
    </>
  );
}
