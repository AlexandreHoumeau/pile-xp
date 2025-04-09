import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { FaRegSave } from "react-icons/fa";
import { PiBlueprint } from "react-icons/pi";
import { RiUploadLine } from "react-icons/ri";

type UploadButtonsProps = {
  photosInputRef: React.RefObject<HTMLInputElement>;
  bluePrintsInputRef: React.RefObject<HTMLInputElement>;
  isValid: boolean;
};

export default function UploadButtons({
  photosInputRef,
  bluePrintsInputRef,
  isValid,
}: UploadButtonsProps) {
  return (
    <div className="flex align-middle justify-between">
      <div className="flex align-middle gap-4 mb-4">
        <AdminIconButton
          className="text-white bg-black rounded-lg hover:bg-gray-700"
          label="Importer des photos"
          icon={<RiUploadLine size={20} className="mb-2" />}
          onClick={() => photosInputRef?.current?.click()}
        />
        <AdminIconButton
          className="text-black bg-white rounded-lg hover:bg-gray-200 border"
          label="Importer des plans"
          icon={<PiBlueprint size={20} className="mb-2" />}
          onClick={() => bluePrintsInputRef?.current?.click()}
        />
      </div>
      <div>
        <AdminIconButton
          disabled={!isValid}
          className="text-black bg-white rounded-lg hover:bg-gray-200 border"
          label="Sauvegader le projet"
          icon={<FaRegSave size={20} className="mb-2" />}
          type="submit"
        />
      </div>
    </div>
  );
}
