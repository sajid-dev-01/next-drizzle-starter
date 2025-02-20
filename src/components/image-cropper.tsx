"use client";

import { useRef, useState } from "react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import { Button } from "./ui/button";

import "react-image-crop/dist/ReactCrop.css";

interface Props {
  src: string;
  onCancle?: () => void;
  onCrop?: (blob: Blob) => void;
}

export function ImageCropper({ src, onCrop, onCancle }: Props) {
  const [crop, setCrop] = useState<Crop>();
  const [storedCrop, setStoredCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);

  async function handleCrop() {
    if (!imageRef.current || !storedCrop) return;

    const blob = await getCroppedImage({
      image: imageRef.current,
      crop: storedCrop,
    });

    if (blob) onCrop?.(blob);
  }

  return (
    <>
      {src ? (
        <ReactCrop
          aspect={1}
          crop={crop}
          onChange={(_, percent) => setCrop(percent)}
          onComplete={(c) => setStoredCrop(c)}
        >
          <img
            ref={imageRef}
            src={src}
            alt="crop"
            className="w-full"
            onLoad={() => {
              // @ts-expect-error
              const { width, height } = imageRef.current;

              if (width && height) {
                setCrop(centerAspectCrop({ width, height, aspect: 1 }));
              }

              URL.revokeObjectURL(src);
            }}
          />
        </ReactCrop>
      ) : (
        <p>No image selected</p>
      )}

      <div className="flex w-full justify-end gap-4">
        <Button variant="outline" onClick={onCancle}>
          Cancle
        </Button>
        <Button onClick={handleCrop}>Apply</Button>
      </div>
    </>
  );
}

function centerAspectCrop({
  height,
  width,
  aspect,
}: {
  width: number;
  height: number;
  aspect: number;
}) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, aspect, width, height),
    width,
    height
  );
}

function getCroppedImage({
  image,
  crop,
}: {
  image: HTMLImageElement;
  crop: PixelCrop;
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  //const pixelRatio = window.devicePixelRatio;
  const pixelRatio = 300 / (crop.width * scaleX);

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 2) Scale the image
  //ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => blob != null && resolve(blob));
  });
}
