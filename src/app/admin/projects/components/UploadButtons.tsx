import { AdminIconButton } from "@/components/admin/button/AdminIconButton";
import { FaRegSave } from "react-icons/fa";
import { PiBlueprint } from "react-icons/pi";
import { RiUploadLine } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";

type UploadButtonsProps = {
  photosInputRef: React.RefObject<HTMLInputElement>;
  bluePrintsInputRef: React.RefObject<HTMLInputElement>;
  onDelete: () => void;
  isValid: boolean;
  isEdit?: boolean;
};

export default function UploadButtons({
  photosInputRef,
  bluePrintsInputRef,
  onDelete,
  isValid,
  isEdit,
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
      <div className="flex align-middle gap-4 mb-4">
        <AdminIconButton
          disabled={!isValid}
          className="text-black bg-white rounded-lg hover:bg-gray-200 border mr-"
          label="Sauvegader le projet"
          icon={<FaRegSave size={20} className="mb-2" />}
          type="submit"
        />
        {isEdit ? (
          <AdminIconButton
            className="text-red-500 bg-red-100 rounded-lg hover:bg-red-200 border border-red-500"
            label="Supprimer le projet"
            icon={<FaRegTrashAlt size={20} className="mb-2" />}
            onClick={onDelete}
          />
        ) : null}
      </div>
    </div>
  );
}
