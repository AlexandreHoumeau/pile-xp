"use client";

import { useState } from "react";

type Bounds = { left: number; top: number; width: number; height: number; aspectRatio: number };

export default function BlueprintImage({ src, alt }: { src: string; alt: string }) {
  const [bounds, setBounds] = useState<Bounds | null>(null);

  return (
    <div
      className={bounds ? "relative w-full overflow-hidden" : "w-full"}
      style={bounds ? { aspectRatio: bounds.aspectRatio } : undefined}
    >
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        className={bounds ? "absolute block max-w-none" : "block h-auto w-full"}
        style={bounds ? {
          width: `${100 / bounds.width}%`,
          height: `${100 / bounds.height}%`,
          left: `${-100 * bounds.left / bounds.width}%`,
          top: `${-100 * bounds.top / bounds.height}%`,
        } : undefined}
        onLoad={(event) => {
          const img = event.currentTarget;
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight));
          canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
          const context = canvas.getContext("2d", { willReadFrequently: true });
          if (!context) return;
          try {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
            let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                if (data[(y * canvas.width + x) * 4 + 3] <= 8) continue;
                left = Math.min(left, x);
                right = Math.max(right, x);
                top = Math.min(top, y);
                bottom = Math.max(bottom, y);
              }
            }
            if (right < left) return;
            // Keep a small margin around fine lines at the image edges.
            left = Math.max(0, left - 2);
            top = Math.max(0, top - 2);
            right = Math.min(canvas.width - 1, right + 2);
            bottom = Math.min(canvas.height - 1, bottom + 2);
            setBounds({
              left: left / canvas.width,
              top: top / canvas.height,
              width: (right - left + 1) / canvas.width,
              height: (bottom - top + 1) / canvas.height,
              aspectRatio: ((right - left + 1) / canvas.width * img.naturalWidth)
                / ((bottom - top + 1) / canvas.height * img.naturalHeight),
            });
          } catch {
            // Images that cannot be inspected keep their original dimensions.
          }
        }}
      />
    </div>
  );
}
