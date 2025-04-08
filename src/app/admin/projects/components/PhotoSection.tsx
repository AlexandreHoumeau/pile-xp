"use client";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Photo } from "@/components/admin/Photo";
import { useState } from "react";
import { PhotoItem } from "../types";

type PhotoSectionProps = {
  selectedPhotos: PhotoItem[];
  handleDeletePhoto: (id: string) => void;
  register: any;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photosInputRef: React.RefObject<HTMLInputElement>;
  setSelectedPhotos: any;
};

export default function PhotoSection({
  selectedPhotos,
  handleDeletePhoto,
  register,
  handleFileChange,
  photosInputRef,
  setSelectedPhotos,
}: PhotoSectionProps) {
  const [hoverPhoto, setHoverPhoto] = useState<string | null>(null);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  const movePhoto = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) return;
    const originalPhoto = getPhotoPosition(String(active.id));
    const newPosition = getPhotoPosition(String(over?.id));
    const newPhotoArray = arrayMove(selectedPhotos, originalPhoto, newPosition);
    setSelectedPhotos(newPhotoArray);
  };

  const getPhotoPosition = (id: string) =>
    selectedPhotos.findIndex((photo) => photo.id === id);

  return (
    <DndContext
      onDragEnd={movePhoto}
      sensors={sensors}
      collisionDetection={closestCorners}
    >
      <SortableContext
        items={selectedPhotos}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex overflow-x-auto whitespace-nowrap gap-8 hide-scrollbar">
          {selectedPhotos.map((photo) => (
            <Photo
              key={photo.id}
              photo={photo}
              setHoverPhoto={setHoverPhoto}
              hoverPhoto={hoverPhoto}
              handleDeletePhoto={handleDeletePhoto}
            />
          ))}
          <input
            {...register("photos", {
              required: true,
              onChange: handleFileChange,
            })}
            accept=".jpg,.png"
            ref={photosInputRef}
            type="file"
            className="hidden"
            multiple
          />
        </div>
      </SortableContext>
    </DndContext>
  );
}
