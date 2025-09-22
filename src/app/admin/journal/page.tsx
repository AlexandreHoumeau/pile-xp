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

type Inputs = {
  title: string;
  photo: File | string;
  date: Date;
  url?: string;
  description: string;
};

interface Journal extends Inputs {
  id: string;
  photo: string | File;
}

export default function Journal() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [editJournalId, setEditJournalId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
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
  } = useForm<Inputs>();

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
      setCropMode(true);
      setValue("photo", file);
      setImageSrc(imageUrl);
    };
    img.src = imageUrl;
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
    if (!imageSrc) return toast.error("No image selected");
    setIsSubmitting(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, {
        ...croppedAreaPixels!,
        x: 0,
        y: 0,
      });

      const file = new File([croppedBlob?.blob!], `${Date.now()}.jpg`, { type: "image/jpeg" });

      const payload = { ...getValues(), photo: file };

      if (editJournalId) {
        await updateJournalEntryById(editJournalId, payload);
        toast.success("Article modifié");
      } else {
        await addJournal(payload);
        toast.success("Image uploadée");
      }

      getJournals();
      resetFormState();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = () => {
    setEditJournalId(null);
    setIsAddingNew(false);
    setImageSrc(null);
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
  };

  const renderForm = () => 
    <JournalForm
      imageSrc={imageSrc}
      crop={crop}
      zoom={zoom}
      cropMode={cropMode}
      isSubmitting={isSubmitting}
      setCrop={setCrop}
      setZoom={setZoom}
      setCropMode={setCropMode}
      setImageSrc={setImageSrc}
      croppedAreaPixels={croppedAreaPixels}
      setCroppedAreaPixels={setCroppedAreaPixels}
      photoInputRef={photoInputRef}
      handleFileChange={handleFileChange}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={submitForm}
      isValid={isValid}
      resetForm={resetFormState}
    />
  ;

  return (
    <div className="min-h-full font-insitutrial">
      {isLoadingList ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {Array.apply(null, Array(12)).map(() => <SkeletonCard />)}
        </div>
      ) : (
			<div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {journals.map((journal) =>
            journal.id === editJournalId ? (
              renderForm()
            ) : (
              <div className="min-h-[481px]" key={journal.id}>
                <img src={journal.photo as string} className="object-cover object-center w-full" />
                <div className="flex font-insitutrial_bold text-xl mt-4 space-x-2">
                  <h1>{dayjs(journal.date).format("DD - MM - YYYY")}</h1>
                  <h1>{journal.title}</h1>
                </div>
                <p>{journal.description}</p>
                {journal.url && <a className="font-insitutrial_bold underline" href={journal.url} target="_blank">En savoir plus</a>}
                <div className="flex gap-2 mt-2">
                  <button className="text-green" onClick={() => handleEdit(journal)}>
                    Modifier
                  </button>
                  <button className="text-pink" onClick={() => handleDelete(journal.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            )
          )}
          {!isAddingNew ? (
            <div
              onClick={() => setIsAddingNew(true)}
              className="flex cursor-pointer border border-pink items-center justify-center"
            >
              <p className="font-insitutrial_bold text-xl text-pink">Ajouter un article</p>
            </div>
          ) : (
            renderForm()
          )}
        </div>
      )}
    </div>
  );
}
