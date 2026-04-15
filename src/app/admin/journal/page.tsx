"use client";

import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { addJournal } from "@/app/actions/journal/add";
import { deleteJournalEntryById } from "@/app/actions/journal/delete";
import { listJournals } from "@/app/actions/journal/list";
import { updateJournalEntryById } from "@/app/actions/journal/update";
import SkeletonCard from "@/components/loaders/SkeletonCard";
import getCroppedImg from "@/utils/cropImage";
import { MAX_FILE_SIZE } from "@/utils/general";
import { JournalForm } from "./JournalForm";
import type { JournalInputs } from "./type";

interface Journal extends JournalInputs {
  id: string;
}

export default function Journal() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [editJournalId, setEditJournalId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropSourceSrc, setCropSourceSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isValid },
  } = useForm<JournalInputs>();

  const getJournals = async () => {
    setIsLoadingList(true);
    try {
      const data = await listJournals();
      setJournals(data || []);
    } catch {
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    getJournals();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("The photo you're trying to upload is bigger than 2mb.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setCroppedAreaPixels({ width: img.width, height: img.height, x: 0, y: 0 });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropMode(true);
      setValue("photo", file);
      setImageSrc(imageUrl);
      setCropSourceSrc(imageUrl);
    };
    img.src = imageUrl;
  };

  const applyCrop = async () => {
    if (!cropSourceSrc || !croppedAreaPixels) {
      toast.error("No crop area selected");
      return;
    }

    const croppedImage = await getCroppedImg(cropSourceSrc, croppedAreaPixels);

    if (!croppedImage) {
      throw new Error("No cropped image available");
    }

    const file = new File([croppedImage.blob], `${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setValue("photo", file, { shouldValidate: true });
    setImageSrc(croppedImage.url);
    setCropSourceSrc(croppedImage.url);
    setCropMode(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntryById(id);
      toast.success("Article supprimé");
      getJournals();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      if (cropMode) {
        throw new Error("Please finish cropping the image before saving");
      }

      const values = getValues();
      const isEditing = Boolean(editJournalId);
      const payload = { ...values };

      if (!isEditing && !(payload.photo instanceof File)) {
        throw new Error("Please select and crop an image");
      }

      if (isEditing) {
        await updateJournalEntryById(editJournalId!, payload);
        toast.success("Article modifié");
      } else {
        if (!(payload.photo instanceof File)) {
          throw new Error("No image selected");
        }

        // 🧩 fix: assert the type for TS
        await addJournal(payload as Omit<JournalInputs, "photo"> & { photo: File });
        toast.success("Image uploadée");
      }

      await getJournals();
      resetFormState();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = () => {
    setEditJournalId(null);
    setIsAddingNew(false);
    setImageSrc(null);
    setCropSourceSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropMode(false);
    setCroppedAreaPixels(null);
    reset();
  };

  const handleEdit = (journal: Journal) => {
    const img = new Image();
    img.onload = () => {
      setCroppedAreaPixels({ width: img.width, height: img.height, x: 0, y: 0 });
    };
    img.src = journal.photo as string;

    setEditJournalId(journal.id);
    setIsAddingNew(false);
    setValue("title", journal.title);
    setValue("description", journal.description);
    setValue("url", journal.url);
    setValue("date", journal.date);
    setValue("photo", journal.photo);
    setImageSrc(journal.photo as string);
    setCropSourceSrc(journal.photo as string);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropMode(false);
  };

  const journalFormProps = {
    imageSrc,
    cropSourceSrc,
    crop,
    zoom,
    cropMode,
    isSubmitting,
    setCrop,
    setZoom,
    setCropMode,
    croppedAreaPixels,
    setCroppedAreaPixels,
    photoInputRef,
    handleFileChange,
    applyCrop,
    register,
    handleSubmit,
    onSubmit: submitForm,
    isValid,
    resetForm: resetFormState,
  };

  return (
    <div className="min-h-full font-insitutrial">
      {isLoadingList ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {journals.map((journal) => {
            if (journal.id === editJournalId) {
              return <JournalForm key={journal.id} {...journalFormProps} />;
            }

            return (
              <div className="min-h-[481px]" key={journal.id}>
                <img
                  src={journal.photo as string}
                  alt="Preview"
                  className="object-cover object-center w-full"
                />
                <div className="flex font-insitutrial_bold text-xl mt-4 space-x-2">
                  <h1>{dayjs(journal.date).format("DD - MM - YYYY")}</h1>
                  <h1>{journal.title as string}</h1>
                </div>
                <p>{journal.description}</p>
                {journal.url && (
                  <a
                    className="font-insitutrial_bold underline"
                    href={journal.url}
                    target="_blank"
                  >
                    En savoir plus
                  </a>
                )}
                <div className="flex gap-2 mt-2">
                  <button className="text-green" onClick={() => handleEdit(journal)}>
                    Modifier
                  </button>
                  <button className="text-pink" onClick={() => handleDelete(journal.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}

          {!isAddingNew ? (
            <div
              onClick={() => setIsAddingNew(true)}
              className="flex cursor-pointer border border-pink items-center justify-center"
            >
              <p className="font-insitutrial_bold text-xl text-pink">Ajouter un article</p>
            </div>
          ) : (
            <JournalForm key="new" {...journalFormProps} />
          )}
        </div>
      )}
    </div>
  );
}
