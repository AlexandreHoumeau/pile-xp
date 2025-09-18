import getCroppedImg from "@/utils/cropImage";
import Cropper from "react-easy-crop";

export function JournalForm({
  imageSrc,
  crop,
  zoom,
  cropMode,
  isSubmitting,
  setCrop,
  setZoom,
  setCropMode,
  setImageSrc,
  croppedAreaPixels,
  setCroppedAreaPixels,
  photoInputRef,
  handleFileChange,
  register,
  handleSubmit,
  onSubmit,
  isValid,
  resetForm,
}: any) {
  console.log(cropMode)
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[481px]"
    >
      <div className="relative w-full min-h-[481px] bg-red-200">
        {imageSrc && cropMode ? (
          <div className="w-full flex-1 relative">
            <Cropper
              objectFit="vertical-cover"
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
            <button
              type="button"
              onClick={async () => {
                setCropMode(false);
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels!);
                setImageSrc(croppedImage?.url);
              }}
              className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1"
            >
              Done
            </button>
          </div>
        ) : imageSrc ? (
          <>
            <img src={imageSrc} className="object-cover object-center w-full" />
            <button
              type="button"
              onClick={() => {
                const img = new Image();
                img.src = imageSrc
                setCroppedAreaPixels({ width: img.width, height: img.height, x: 0, y: 0 })
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
