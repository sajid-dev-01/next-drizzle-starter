/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Image from "next/image";
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

    const canvas = cropImage(imageRef.current, storedCrop);
    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((blob) => {
        blob ? res(blob) : rej("No blob");
      });
    });

    onCrop?.(blob);
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
          {/* <img ref={imageRef} src={src} alt="Crop me" height={400} /> */}
          <Image
            src={src}
            ref={imageRef}
            alt=""
            onLoad={() => {
              // @ts-ignore
              const { width, height } = imageRef.current;

              if (width && height) setCrop(centerAspectCrop(width, height, 1));

              URL.revokeObjectURL(src);
            }}
            className="w-full"
            width={30}
            height={30}
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

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function cropImage(image: HTMLImageElement, crop: PixelCrop) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.translate(centerX, centerY);
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

  return canvas;
}
