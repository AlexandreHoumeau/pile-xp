"use client";
import { addAboutInfo } from "@/app/actions/about/add";
import { AboutSection, getAboutInfo } from "@/app/actions/about/get";
import { updateAboutInfo } from "@/app/actions/about/update";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { InputComponent } from "@/components/Input";
import TextareaComponent from "@/components/TextArea";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPlus, FaRegSave, FaTrash } from "react-icons/fa";

type Section = {
  title: string;
  description: string;
};

type FormValues = {
  id?: string;
  sections: Section[];
  photos: string[];
};

export default function AboutAdminPage() {
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      sections: [{ title: "", description: "" }],
      photos: ["", "", "", ""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const [newPhotos, setNewPhotos] = useState<(File | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const photoInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // 🧠 Load data from Supabase
  useEffect(() => {
    const loadAboutInfo = async () => {
      setLoading(true);
      const data = await getAboutInfo();

      if (!data) {
        setLoading(false);
        return;
      }

      reset({
        id: data.id,
        sections: data.sections.length ? data.sections : [{ title: "", description: "" }],
        photos: Array.isArray(data.photos)
          ? [...data.photos, "", "", "", ""].slice(0, 4)
          : ["", "", "", ""],
      });
      setLoading(false);
    };
    loadAboutInfo();
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        sections: data.sections as AboutSection[],
        photos: data.photos.map((p, i) => newPhotos[i] || p),
      };
      console.log(data)
      if (data.id) {
        await updateAboutInfo(data.id, payload.sections, payload.photos);
        toast.success("À propos mis à jour !");
      } else {
        await addAboutInfo(payload.sections, payload.photos);
        toast.success("À propos créé !");
      }

      setNewPhotos([null, null, null, null]);
    } catch (err) {
      console.error(err);
      toast.error("Échec de l’enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-insitutrial_bold text-3xl">Pile.XP - À propos</h1>
        <AdminIconButton
          disabled={loading}
          className="text-black bg-white hover:bg-gray-200 border"
          label={loading ? "Enregistrement..." : "Enregistrer"}
          icon={<FaRegSave size={20} className="mb-2" />}
          type="submit"
        />
      </div>

      {/* Two-column layout */}
      <div className="flex justify-between gap-8 font-insitutrial">
        {/* LEFT: Sections */}
        <div className="w-full space-y-8">
          <h2 className="text-2xl">Sections</h2>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 p-4 space-y-4 bg-gray-50"
            >
              <div className="flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Supprimer
                </button>
              </div>

              <Controller
                name={`sections.${index}.title`}
                control={control}
                render={({ field }) => (
                  <InputComponent
                    {...field}
                    label="Titre de la section"
                    placeholder="Entrez un titre"
                  />
                )}
              />

              <Controller
                name={`sections.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextareaComponent
                    {...field}
                    label="Description"
                    placeholder="Texte descriptif (liens, texte en gras, etc.)"
                    required={false}
                  />
                )}
              />
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => append({ title: "", description: "" })}
              className="flex items-center gap-2 px-4 py-2 border border-black hover:bg-gray-100"
            >
              <FaPlus /> Ajouter une section
            </button>
          </div>
        </div>

        {/* RIGHT: Photos */}
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Photos</h2>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <Controller
                key={idx}
                name={`photos.${idx}`}
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="flex h-auto flex-1 justify-center">
                      <div className="relative w-64 h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
                        {newPhotos[idx] ? (
                          <Image
                            src={URL.createObjectURL(newPhotos[idx]!)}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : field.value ? (
                          <Image
                            src={field.value}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">Aucune photo</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2">
                      <AdminIconButton
                        type="button"
                        label={field.value ? "Modifier la photo" : "Ajouter une photo"}
                        onClick={() => photoInputRefs[idx].current?.click()}
                        className="text-center border border-black min-h-max"
                      />
                      <input
                        ref={photoInputRefs[idx]}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const updatedPhotos = [...newPhotos];
                            updatedPhotos[idx] = e.target.files[0];
                            setNewPhotos(updatedPhotos);
                          }
                        }}
                      />
                      {field.value && (
                        <AdminIconButton
                          type="button"
                          label="Supprimer"
                          onClick={() => {
                            setValue(`photos.${idx}`, "");
                            const updatedPhotos = [...newPhotos];
                            updatedPhotos[idx] = null;
                            setNewPhotos(updatedPhotos);
                          }}
                          className="text-center min-h-max border-pink text-pink border"
                        />
                      )}
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
