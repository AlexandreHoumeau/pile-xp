"use client";
import { saveDraft } from "@/app/actions/projects/add";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BlueprintSection from "../components/BlueprintSection";
import PhotoSection from "../components/PhotoSection";
import ProjectDetails from "../components/ProjectDetails";
import UploadButtons from "../components/UploadButtons";
import { technicalData } from "../technicalData";
import { Inputs, PhotoItem } from "../types";

export default function AddProject() {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoItem[]>([]);
  const [selectedBluePrints, setSelectedBluePrints] = useState<PhotoItem[]>([]);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const bluePrintsInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid },
  } = useForm<Inputs>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;

    if (files?.length) {
      const selectedFiles: PhotoItem[] = Array.from(files).map((file) => {
        return {
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file),
          file,
        };
      });
      if (name === "photos") {
        const newSelectedPhotos = [...selectedPhotos, ...selectedFiles];
        setSelectedPhotos(newSelectedPhotos);
        setValue("photos", newSelectedPhotos);
      } else {
        setSelectedBluePrints([...selectedBluePrints, ...selectedFiles]);
      }
    }
  };

  const handleDeletePhoto = (id: string, type?: string) => {
    if (type === "blueprint")
      return setSelectedBluePrints(
        selectedBluePrints.filter((bp) => bp.id !== id)
      );
    return setSelectedPhotos(selectedPhotos.filter((photo) => photo.id !== id));
  };

  const save = async () => {
    try {
      toast.promise(
        async () => {
          const formData = getValues();

          const photosToStore = selectedPhotos.map((photo) => photo.file);
          const blueprintsToStore = selectedBluePrints.map((bp) => bp.file);

          await saveDraft(formData, photosToStore, blueprintsToStore);
        },
        {
          loading: "Loading",
          success: "Project created with success!",
          error: (error) => error.message,
        }
      );
    } catch {
      router.push("/admin/projects/new");
    }
  };

  return (
    <div className="font-insitutrial">
      <form onSubmit={handleSubmit(save)}>
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
    </div>
  );
}
