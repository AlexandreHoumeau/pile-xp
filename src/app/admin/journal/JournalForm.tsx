import Cropper from "react-easy-crop";
import { JournalFormProps } from "./type";

export function JournalForm({
  imageSrc,
  cropSourceSrc,
  crop,
  zoom,
  cropMode,
  isSubmitting,
  setCrop,
  setZoom,
  setCropMode,
  setCroppedAreaPixels,
  photoInputRef,
  handleFileChange,
  applyCrop,
  register,
  handleSubmit,
  onSubmit,
  isValid,
  resetForm,
}:
  JournalFormProps
) {
  return (
    <form
    key={"new_form"}
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[481px]"
    >
      <div className="relative w-full min-h-[481px]">
        {cropSourceSrc && cropMode ? (
          <div className="w-full h-[481px] relative">
            <Cropper
              objectFit="vertical-cover"
              image={cropSourceSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
            <button
              type="button"
              onClick={applyCrop}
              className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
            >
              Done
            </button>
          </div>
        ) : imageSrc ? (
          <>
            <img alt="Preview" src={imageSrc} className="object-cover object-center w-full" />
            <button
              type="button"
              onClick={() => {
                setCropMode(true)
              }}
              className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
            >
              Crop
            </button>
          </>
        ) : null}

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
        <button
          type="button"
          onClick={() => photoInputRef.current?.click()}
          className="absolute bottom-2 left-2 bg-white text-sm px-2 py-1"
        >
          {imageSrc ? "Changer la photo" : "Ajouter une photo"}
        </button>
      </div>
      <div className="flex flex-col space-y-4 mt-4">

        <input {...register("title", { required: true })} placeholder="Titre" />
        <textarea {...register("description")} placeholder="Description" />
        <input type="date" {...register("date", { required: true })} />
        <input type="url" {...register("url", { required: false })} placeholder="Link" />

        <button type="submit" className="bg-pink text-white py-2" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
        </button>

        <button
          type="button"
          className="border-pink border text-pink py-2"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
