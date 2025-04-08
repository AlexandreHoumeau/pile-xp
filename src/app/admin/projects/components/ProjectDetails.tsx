import { InputComponent } from "@/components/Input";
import TextareaComponent from "@/components/TextArea";

type ProjectDetailsProps = {
  register: any;
  technicalData: { label: string; input_name: string }[];
};

export default function ProjectDetails({ register, technicalData }: ProjectDetailsProps) {
  return (
    <div className="mt-4 space-y-8 font-insitutrial">
      <input
        type="text"
        className={`bg-transparent text-pink text-3xl focus:outline-none font-insitutrial_bold`}
        {...register("title", { required: true })}
        placeholder="Titre du projet"
      />
      <div className="space-y-2">
        <h1 className="font-insitutrial_bold text-pink text-2xl">Données techniques</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {technicalData.slice(0, Math.ceil(technicalData.length / 2)).map((data) => (
              <InputComponent {...register(data.input_name as any)} key={data.input_name} label={data.label} />
            ))}
          </div>
          <div className="space-y-4">
            {technicalData.slice(Math.ceil(technicalData.length / 2), technicalData.length).map((data) => (
              <InputComponent {...register(data.input_name as any)} key={data.input_name} label={data.label} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="font-insitutrial_bold mb-4 text-pink text-2xl">Déscrition du projet</h1>
        <TextareaComponent
          label="Description"
          required={false}
          placeholder="Entrez une description"
          {...register("description")}
        />
      </div>
    </div>
  );
}
