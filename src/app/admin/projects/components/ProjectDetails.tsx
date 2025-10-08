import { useEffect, useState } from "react";
import { InputComponent } from "@/components/Input";
import TextareaComponent from "@/components/TextArea";
import { UseFormRegister } from "react-hook-form";
import { Inputs } from "../types";
import { FaTimes } from "react-icons/fa";
import { TagInput } from "@/components/admin/TagInput";
import { listTags } from "@/app/actions/tag/list";

type ProjectDetailsProps = {
  register: UseFormRegister<Inputs>;
  pdf?: File | null | string;
  programTags?: string[];
  technicalData: { label: string; input_name: string }[];
  onProgramChange: (tags: string[]) => void;
  onPdfChange: (file: File | null) => void;
};

export default function ProjectDetails({
  register,
  pdf,
  programTags,
  technicalData,
  onProgramChange,
  onPdfChange,
}: ProjectDetailsProps) {
  const [programmeTags, setProgrammeTags] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [existingTags, setExistingTags] = useState<string[]>([]);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await listTags();
        setExistingTags(data || []);
      } catch (error) {
       console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);
  const removePdf = () => {
    setPdfFile(null);
    setPdfUrl(null);
    onPdfChange(null);
  };

  useEffect(() => {
    onProgramChange(programmeTags);
  }, [programmeTags, onProgramChange]);

  useEffect(() => {
    onPdfChange(pdfFile);
  }, [pdfFile, onPdfChange]);

  useEffect(() => {
    if (programTags?.length) {
      setProgrammeTags(programTags);
    }
  }, [programTags]);

  useEffect(() => {
    if (typeof pdf === "string") {
      setPdfUrl(pdf);
      setPdfFile(null);
    } else if (pdf instanceof File) {
      setPdfFile(pdf);
      setPdfUrl(null);
    } else {
      setPdfFile(null);
      setPdfUrl(null);
    }
  }, [pdf]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setPdfUrl(null);
    }
  };

  const getPdfName = () => {
    if (pdfFile) return pdfFile.name;
    if (pdfUrl) return decodeURIComponent(pdfUrl.split("/").pop() || "document.pdf");
    return null;
  };

  return (
    <div className="mt-4 space-y-8 font-insitutrial">
      <input
        type="text"
        className="bg-transparent text-pink text-3xl focus:outline-none font-insitutrial_bold"
        {...register("title", { required: true })}
        placeholder="Titre du projet"
      />

      <div className="space-y-2">
        <h1 className="font-insitutrial_bold text-pink text-2xl">
          Données techniques
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {technicalData
              .slice(0, Math.ceil(technicalData.length / 2))
              .filter((d) => d.input_name !== "program")
              .map((data) => (
                <InputComponent
                  {...register(data.input_name as keyof Inputs)}
                  key={data.input_name}
                  label={data.label}
                />
              ))}
          </div>
          <div className="space-y-4 mb-24">
            {technicalData
              .slice(Math.ceil(technicalData.length / 2), technicalData.length)
              .filter((d) => d.input_name !== "program")
              .map((data) => (
                <InputComponent
                  {...register(data.input_name as keyof Inputs)}
                  key={data.input_name}
                  label={data.label}
                />
              ))}
          </div>
        </div>
        <div className="mt-4">
          <h1 className="font-insitutrial_bold mb-4 text-pink text-2xl">
            Déscrition du projet
          </h1>
          <TextareaComponent
            label="Description"
            required={false}
            placeholder="Entrez une description"
            {...register("description", { required: false })}
          />
        </div>
        <TagInput
          value={programmeTags}
          existingTags={existingTags}
          onChange={setProgrammeTags}
          placeholder="Ajoutez un programme et appuyez sur Entrée"
        />
      </div>

      <div className="mt-4 space-y-2 grid grid-cols-2 gap-4">
        <div>
          <h1 className="font-insitutrial_bold text-pink text-2xl">PDF</h1>
          {!pdfFile && !pdfUrl ? (
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="text-lg text-pink file:mr-5 file:p-2 file:border file:text-lg file:font-insitutrial file:bg-stone-50 file:text-pink"
            />
          ) : (
            <div className="flex items-center gap-2 text-pink">
              <a
                href={pdfFile ? URL.createObjectURL(pdfFile) : pdfUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-pink/80"
              >
                {getPdfName()}
              </a>
              <FaTimes className="cursor-pointer" onClick={removePdf} />
            </div>
          )}
        </div>

        <InputComponent
          {...register("youtube_url", { required: false })}
          label="Youtube"
        />
      </div>
    </div>
  );
}
