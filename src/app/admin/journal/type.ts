import type { Area } from "react-easy-crop";
import type { RefObject, ChangeEvent } from "react";
import type { FieldValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

export type JournalInputs = {
  title: string;
  photo: File | string | null;
  date: Date;
  url?: string;
  description: string;
};

export type JournalFormProps = {
  imageSrc: string | null;
  cropSourceSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  cropMode: boolean;
  isSubmitting: boolean;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setCropMode: (b: boolean) => void;
  croppedAreaPixels: Area | null;
  setCroppedAreaPixels: (v: Area | null) => void;
  photoInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  applyCrop: () => Promise<void>;
  register: UseFormRegister<JournalInputs>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  onSubmit: () => Promise<void>;
  isValid: boolean;
  resetForm: () => void;
};
