"use client";

import { PencilIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Dropzone, { DropzoneProps } from "react-dropzone";

import { formatBytes } from "@/lib/utils";

import { ImageCropper } from "../ImageCropper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  initialImage?: string | null;
  onUpload?: (file: File) => void;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  maxFiles?: DropzoneProps["maxFiles"];
  multiple?: boolean;
  disabled?: boolean;
}

export const AvatarUploader: React.FC<Props> = ({
  initialImage,
  onUpload,
  accept = { "image/*": [] },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  multiple = false,
  disabled = false,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File>();
  const [croppedImageUrl, setCroppedImageUrl] = useState(initialImage || "");

  function onDrop(files: any) {
    const file = files[0];

    if (file) {
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  function handleCrop(blob: Blob) {
    setCroppedImageUrl(URL.createObjectURL(blob));
    setImageUrl("");

    if (!selectedImage || !blob) return;

    const file = new File([blob], selectedImage.name, { type: blob.type });

    onUpload?.(file);
  }

  useEffect(() => {
    // revoke the data uris to avoid memory leaks.
    return () => {
      URL.revokeObjectURL(imageUrl);
      URL.revokeObjectURL(croppedImageUrl);
    };
  }, []);

  return imageUrl ? (
    <Dialog open modal onOpenChange={(v) => !v && setImageUrl("")}>
      <DialogContent className="w-72">
        <DialogHeader className="items-center">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <ImageCropper
          src={imageUrl}
          onCrop={handleCrop}
          onCancle={() => setImageUrl("")}
        />
      </DialogContent>
    </Dialog>
  ) : (
    <Dropzone
      onDrop={onDrop}
      accept={accept}
      maxSize={maxSize}
      maxFiles={maxFiles}
      multiple={maxFiles > 1 || multiple}
      disabled={disabled}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className="border-muted-foreground/25 hover:bg-muted/25 ring-offset-background focus-visible:ring-ring group relative grid size-52 cursor-pointer place-items-center rounded-full border-2 border-dashed text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <input {...getInputProps()} />
          {croppedImageUrl ? (
            <>
              <Image
                src={croppedImageUrl}
                onLoad={() => URL.revokeObjectURL(croppedImageUrl)}
                alt=""
                className="size-full rounded-full"
                width={30}
                height={30}
              />
              <div className="text-primary absolute bottom-0 flex h-10 w-full items-center justify-center bg-black/50 transition group-hover:bg-black/70">
                <PencilIcon />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <UploadIcon
                className="text-muted-foreground size-7"
                aria-hidden="true"
              />
              {isDragActive ? (
                <p className="text-muted-foreground font-medium">
                  Drop the files here
                </p>
              ) : (
                <div className="flex flex-col gap-px">
                  <p className="text-muted-foreground font-medium">
                    Drag {`'n'`} drop or click here
                  </p>
                  <p className="text-muted-foreground/70 text-sm">
                    You can upload a file with {formatBytes(maxSize)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};
