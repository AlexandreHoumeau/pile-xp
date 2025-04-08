"use client";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    if (files?.length) {
      const selectedFiles: PhotoItem[] = Array.from(files).map((photo) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(photo),
      }));
      if (name === "photos") {
        setSelectedPhotos([...selectedPhotos, ...selectedFiles]);
      } else {
        setSelectedBluePrints([...selectedBluePrints, ...selectedFiles]);
      }
    }
  };

  const handleDeletePhoto = (id: string, type?: string) => {
    if (type === "pblue")
    setSelectedPhotos(selectedPhotos.filter((photo) => photo.id !== id));
  };

  return (
    <div className="font-insitutrial">
      <UploadButtons
        photosInputRef={photosInputRef}
        bluePrintsInputRef={bluePrintsInputRef}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
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
          />
        </div>
      </form>
    </div>
  );
}
