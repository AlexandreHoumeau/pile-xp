"use client";
import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg from "@/utils/cropImage";

export default function PhotoCropper({
  file,
  onCropDone,
}: {
  file: File;
  onCropDone: (blob: Blob) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useState(() => {
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  });

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
    onCropDone(croppedBlob?.blob!);
  };

  return (
    <div className="relative w-full h-[310px]">
      <Cropper
        aspect={1}
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <button
        type="button"
        onClick={handleCrop}
        className="absolute bottom-2 right-2 bg-pink text-white px-3 py-1 rounded"
      >
        Crop
      </button>
    </div>
  );
}
