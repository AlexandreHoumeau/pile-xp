"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaRegSave } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

import { getContactInfo } from "@/app/actions/contact/getContactInfo";
import { updateContactInfo } from "@/app/actions/contact/updateContactInfo";
import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import SortableItem from "@/components/admin/SortableItem";
import { InputComponent } from "@/components/Input";
import TextareaComponent from "@/components/TextArea";

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FormValues = {
  description: string;
  id: string;
  photo_url: string;
  email: string;
  phone_number: string;
  faq: FAQItem[];
};

export default function ContactPage() {
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      description: "",
      email: "",
      phone_number: "",
      photo_url: "",
      faq: [{ id: crypto.randomUUID(), question: "", answer: "" }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "faq",
    keyName: "keyId",
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    const loadContactInfo = async () => {
      const data = await getContactInfo();
      if (!data) return;
			console.log(data.photo_url)
      reset({
        description: data.description,
        email: data.email,
        phone_number: data.phone_number,
        photo_url: data.photo_url,
        faq: data.faq.map((faq: any) => ({
          id: faq.id ?? crypto.randomUUID(),
          question: faq.question,
          answer: faq.answer,
        })),
      });
    };
    loadContactInfo();
  }, [reset]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await updateContactInfo(data, newPhoto); // 👈 send file if exists
      toast.success("Contact informations saved");
      setNewPhoto(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <h1 className="font-insitutrial_bold text-3xl">Pile.XP</h1>
        <AdminIconButton
          disabled={false}
          className="text-black bg-white rounded-lg hover:bg-gray-200 border"
          label="Enregistrer"
          icon={<FaRegSave size={20} className="mb-2" />}
          type="submit"
        />
      </div>

      <div className="flex justify-between gap-8">
        {/* LEFT FORM */}
        <div className="w-full space-y-8">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaComponent
                {...field}
                label="Description de Pile.XP"
                required={false}
                placeholder="Entrez une description"
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputComponent
                {...field}
                label="Email"
                required={false}
                placeholder="Entrez un email"
              />
            )}
          />
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <InputComponent
                {...field}
                label="Numéro de téléphone"
                required={false}
                placeholder="Entrez un numéro téléphone"
              />
            )}
          />

          <div className="mt-10">
            <h1 className="font-insitutrial_bold text-3xl mb-6">
              Vous avez une question ?
            </h1>

            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 mb-4">
                  {fields.map((item, index) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="border-black border p-4 shadow-sm bg-white">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-insitutrial_bold text-pink">
                            Question {index + 1}
                          </h2>
                          <AdminIconButton
                            type="button"
                            onClick={() => remove(index)}
                            label="Supprimer"
                            className="text-right min-h-max rounded-lg text-sm"
                          />
                        </div>
                        <div className="mt-4 space-y-4">
                          <Controller
                            name={`faq.${index}.question`}
                            control={control}
                            render={({ field }) => (
                              <InputComponent
                                {...field}
                                label="Question"
                                placeholder="Entrez une question"
                              />
                            )}
                          />
                          <Controller
                            name={`faq.${index}.answer`}
                            control={control}
                            render={({ field }) => (
                              <TextareaComponent
                                {...field}
                                label="Réponse"
                                placeholder="Entrez une réponse"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <AdminIconButton
              label="Ajouter une question"
              onClick={() =>
                append({ id: crypto.randomUUID(), question: "", answer: "" })
              }
              className="text-center min-h-max rounded-lg border-pink text-pink border"
            />
          </div>
        </div>

        {/* RIGHT FIXED PHOTO PANEL */}
        <div className="w-full sticky top-10 h-fit border p-4 bg-white shadow-sm">
          <h2 className="font-insitutrial_bold text-xl mb-4">Photo</h2>

          <Controller
            name="photo_url"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                {newPhoto ? (
                  <Image
                    src={URL.createObjectURL(newPhoto)}
                    alt="preview"
                    width={300}
                    height={200}
                    className="object-cover rounded-lg"
                  />
                ) : field.value ? (
                  <Image
                    src={field.value}
                    alt="photo"
                    width={300}
                    height={200}
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span>Aucune photo</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewPhoto(e.target.files[0]);
                    }
                  }}
                />
                {field.value && (
                  <AdminIconButton
                    type="button"
                    label="Supprimer la photo"
                    onClick={() => {
                      setValue("photo_url", "");
                      setNewPhoto(null);
                    }}
                    className="rounded-lg border-pink text-pink border"
                  />
                )}
              </div>
            )}
          />
        </div>
      </div>
    </form>
  );
}
