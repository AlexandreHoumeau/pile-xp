"use client";
import { PhotoItem } from "@/app/admin/projects/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { Dispatch, SetStateAction } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

export type PhotoProps = {
  photo: PhotoItem;
  hoverPhoto: string | null;
  setHoverPhoto: Dispatch<SetStateAction<string | null>>;
  handleDeletePhoto: (id: string) => void;
};

export const Photo: React.FC<PhotoProps> = ({
  photo,
  hoverPhoto,
  setHoverPhoto,
  handleDeletePhoto,
}) => {
  const isHoveringPhoto = photo.id === hoverPhoto;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.id });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    zIndex: 0,
  };

  return (
    <div
      onMouseEnter={() => setHoverPhoto(photo.id)}
      onMouseLeave={() => setHoverPhoto(null)}
      className="flex-shrink-0 relative -z-50"
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      {isHoveringPhoto && (
        <div
          onClick={() => handleDeletePhoto(photo.id)}
          className="bg-black rounded-lg cursor-pointer p-2 absolute top-5 right-5 z-50"
        >
          <RiDeleteBinLine size={27} color="white" className="z-50" />
        </div>
      )}
      <img key={photo.id} className="h-[476px]" src={photo.url} alt="Preview" />
    </div>
  );
};
