import { Blueprint } from "@/components/admin/BluePrint";
import { Inputs, PhotoItem } from "../types";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

type BlueprintSectionProps = {
  selectedBluePrints: PhotoItem[];
  register: UseFormRegister<Inputs>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bluePrintsInputRef: React.RefObject<HTMLInputElement>;
  handleDeletePhoto: (id: string, type?: string) => void;
};

export default function BlueprintSection({
  selectedBluePrints,
  register,
  handleFileChange,
  bluePrintsInputRef,
  handleDeletePhoto,
}: BlueprintSectionProps) {
  const [hoverPhoto, setHoverPhoto] = useState<string | null>(null);

  return (
    <div className="mt-4">
      <input
        {...register("blueprints", { onChange: handleFileChange })}
        accept=".jpg,.png"
        ref={bluePrintsInputRef}
        type="file"
        className="hidden"
        multiple
      />
      <div className="space-y-8 flex-col m-10">
        {selectedBluePrints.map((blueprint) => (
          <Blueprint
            key={blueprint.id}
            blueprint={blueprint}
            setHoverPhoto={setHoverPhoto}
            hoverPhoto={hoverPhoto}
            handleDeletePhoto={handleDeletePhoto}
          />
        ))}
      </div>
    </div>
  );
}
