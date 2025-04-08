import { Blueprint } from "@/components/admin/BluePrint";
import { PhotoItem } from "../types";
import { useState } from "react";
import { MouseSensor, useSensor } from "@dnd-kit/core";

type BlueprintSectionProps = {
  selectedBluePrints: PhotoItem[];
  register: any;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bluePrintsInputRef: React.RefObject<HTMLInputElement>;
};

export default function BlueprintSection({
  selectedBluePrints,
  register,
  handleFileChange,
  bluePrintsInputRef,
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
            handleDeletePhoto={(id) => console.log(id)}
          />
        ))}
      </div>
    </div>
  );
}
