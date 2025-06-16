"use client";

import getCroppedImg from "@/utils/cropImage";
import { MAX_FILE_SIZE } from "@/utils/general";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { addJournal } from "@/app/actions/journal /add";
import { deleteJournalEntryById } from "@/app/actions/journal /delete";
import { listJournals } from "@/app/actions/journal /list";
import { updateJournalEntryById } from "@/app/actions/journal /update";
import type { Area } from "react-easy-crop";

type Inputs = {
  title: string;
  photo: File | string;
  date: Date;
  description: string;
};

export default function Journal() {
  const [journals, setJournals] = useState<any[]>([]);
  const [editJournalId, setEditJournalId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [cropMode, setCropMode] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const photoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isValid },
  } = useForm<Inputs>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      return toast.error(
        "The photo you're trying to upload is bigger than 2mb."
      );
    }
    setValue("photo", file);
    setImageSrc(URL.createObjectURL(file));
  };

  const handleCropComplete = (_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntryById(id);
      toast.success("Article supprimé");
      getJournals();
    } catch (err: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const submitForm = async (data: Inputs) => {
    try {
      if (!imageSrc) return toast.error("No image selected");
      const formValues = getValues();

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels!);
      const file = new File([croppedBlob!], `${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      console.log(croppedBlob);
      console.log(file);
      if (editJournalId) {
        await updateJournalEntryById(editJournalId, {
          ...formValues,
          photo: file,
        });
        toast.success("Article modifié");
      } else {
        await addJournal({
          ...formValues,
          photo: file,
        });
        toast.success("Image uploadée");
      }

      getJournals();
      setEditJournalId(null);
      setImageSrc(null);
      reset();
      // setCrop({ x: 0, y: 0 });
      // setZoom(1);
      // setCroppedAreaPixels({ width: 0, height: 0, x: 0, y: 0 });
    } catch (error: any) {
      return toast.error(error.message);
    }
  };

  const getJournals = async () => {
    const data = await listJournals();
    setJournals(data!);
  };

  useEffect(() => {
    getJournals();
  }, []);

  return (
    <div className="min-h-full font-insitutrial">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
        {journals.map((journal) =>
          journal.id === editJournalId ? (
            <form
              key={journal.id}
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col gap-2 border border-pink p-2 min-h-[481px]"
            >
              <div className="relative w-full h-[310px] bg-slate-200">
                {imageSrc && cropMode && (
                  <div className="h-[310px]">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      // zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        setCropMode(false);
                        const croppedImage = await getCroppedImg(
                          imageSrc,
                          croppedAreaPixels!
                        );
                        setImageSrc(URL.createObjectURL(croppedImage!));
                      }}
                      className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
                    >
                      Done
                    </button>
                  </div>
                )}
                {imageSrc && !cropMode && (
                  <img
                    src={imageSrc}
                    className="h-[310px] w-full object-cover"
                  />
                )}

                <input
                  {...register("photo", {
                    required: true,
                    onChange: handleFileChange,
                  })}
                  accept=".jpg,.png"
                  ref={photoInputRef}
                  type="file"
                  className="hidden"
                />
                {imageSrc && !cropMode && (
                  <button
                    type="button"
                    onClick={() => setCropMode(true)}
                    className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
                  >
                    Crop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-2 left-2 bg-white text-sm px-2 py-1"
                >
                  {imageSrc ? "Changer la photo" : "Ajouter une photo"}
                </button>
              </div>
              <input
                {...register("title", { required: true })}
                placeholder="Titre"
              />
              <textarea
                {...register("description")}
                placeholder="Description"
              />
              <input type="date" {...register("date", { required: true })} />
              <button
                type="submit"
                className="bg-pink text-white py-2"
                disabled={!isValid}
              >
                Sauvegarder
              </button>
              <button
                className="border-pink border text-pink py-2"
                onClick={() => {
                  setEditJournalId(null);
                  reset();
                  setImageSrc(null);
                }}
              >
                Annuler
              </button>
            </form>
          ) : (
            <div className="min-h-[481px]" key={journal.id}>
              <img
                src={journal.photo}
                className="object-cover object-center h-[337px] w-full"
              />
              <div className="flex font-insitutrial_bold space-x-2">
                <p>{journal.date}</p>
                <p>{journal.title}</p>
              </div>
              <p>{journal.description}</p>
              <div className="flex gap-2 mt-2 font-insitutrial_bold">
                <button
                  className="text-green"
                  onClick={() => {
                    const img = new Image();
                    img.src = journal.photo;

                    setEditJournalId(journal.id);
                    setIsAddingNew(false);
                    setValue("title", journal.title);
                    setValue("description", journal.description);
                    setValue("date", journal.date);
                    setValue("photo", journal.photo);
                    setImageSrc(journal.photo[0]);
                    // setCroppedAreaPixels({
                    //   width: img.width,
                    //   height: img.height,
                    //   x: 0,
                    //   y: 0,
                    // });
                    // setCrop({ x: 0, y: 0 });
                    // setZoom(1);
                  }}
                >
                  Modifier
                </button>

                <button
                  className="text-pink"
                  onClick={() => handleDelete(journal.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )
        )}
        {!isAddingNew ? (
          <div
            onClick={() => setIsAddingNew(true)}
            className="flex h-[481px] cursor-pointer border border-pink items-center justify-center"
          >
            <p className="font-insitutrial_bold text-xl text-pink ">
              Ajouter un article
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(submitForm)}
            className="flex flex-col gap-2 border border-pink p-2"
          >
            <div className="relative w-full h-[310px] bg-slate-200">
              {imageSrc && cropMode && (
                <div className="h-[310px]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      setCropMode(false);
                      const croppedImage = await getCroppedImg(
                        imageSrc,
                        croppedAreaPixels!
                      );
                      setImageSrc(URL.createObjectURL(croppedImage!));
                    }}
                    className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
                  >
                    Done
                  </button>
                </div>
              )}
              {imageSrc && !cropMode && (
                <img src={imageSrc} className="h-[310px] w-full object-cover" />
              )}

              <input
                {...register("photo", {
                  required: true,
                  onChange: handleFileChange,
                })}
                accept=".jpg,.png"
                ref={photoInputRef}
                type="file"
                className="hidden"
              />
              {imageSrc && !cropMode && (
                <button
                  type="button"
                  onClick={() => setCropMode(true)}
                  className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
                >
                  Crop
                </button>
              )}
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute bottom-2 left-2 bg-white text-sm px-2 py-1"
              >
                {imageSrc ? "Changer la photo" : "Ajouter une photo"}
              </button>
            </div>
            <input
              {...register("title", { required: true })}
              placeholder="Titre"
            />
            <textarea {...register("description")} placeholder="Description" />
            <input type="date" {...register("date", { required: true })} />
            <button
              type="submit"
              className="bg-pink text-white py-2"
              disabled={!isValid}
            >
              Sauvegarder
            </button>
            <button
              className="border-pink border text-pink py-2"
              onClick={() => {
                setIsAddingNew(false);
                setEditJournalId(null);
                reset();
                setImageSrc(null);
              }}
            >
              Annuler
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
