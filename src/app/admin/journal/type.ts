import type { UseFormRegister, UseFormHandleSubmit, FieldValues } from "react-hook-form";
import { JournalInputs } from "./page";

export type JournalFormProps = {
    imageSrc: string | null;
    crop: { x: number; y: number };
    zoom: number;
    cropMode: boolean;
    isSubmitting: boolean;
    setCrop: (crop: { x: number; y: number }) => void;
    setZoom: (zoom: number) => void;
    setCropMode: (b: boolean) => void;
    setImageSrc: (src: string | null) => void;
    croppedAreaPixels: { width: number; height: number; x: number; y: number } | null;
    setCroppedAreaPixels: (v: { width: number; height: number; x: number; y: number } | null) => void;
    photoInputRef: React.RefObject<HTMLInputElement>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register: UseFormRegister<JournalInputs>;
    handleSubmit: UseFormHandleSubmit<FieldValues>;
    onSubmit: () => Promise<string | undefined>;
    isValid: boolean;
    resetForm: () => void;
};
