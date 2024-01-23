"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { UploadDropzone } from "@/lib/uploadthing";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import axios from "axios";

type FileUploadProps = {
  endpoint: keyof OurFileRouter;
  value: string;
  onChange: (url?: string) => void;
  alt: string;
};

export const FileUpload = ({
  endpoint,
  value,
  onChange,
  alt,
}: FileUploadProps) => {
  const isImage = value && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(value);

  const deleteValue = async () => {
    await axios.delete("/api/uploadthing", {
      data: {
        url: value,
      },
    });
  };

  if (isImage)
    return (
      <div className={"relative flex aspect-square h-20 w-20"}>
        <Image
          src={value}
          alt={alt}
          fill
          className={"rounded-full"}
          sizes={"(max-width: 80px)"}
        />
        <button
          onClick={async () => {
            await deleteValue();
            onChange("");
          }}
          className={
            "absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          }
          type={"button"}
        >
          <X className={"h-4 w-4"} />
        </button>
      </div>
    );

  return (
    <UploadDropzone
      endpoint={endpoint}
      onBeforeUploadBegin={(files) => {
        // change the file name to something unique ,for deleting purposes
        return files.map(
          (f) =>
            new File(
              [f],
              `${f.name.replace(/\s/g, "_")}-${uuidv4()}.${f.type.split("/")[1]}`,
              {
                type: f.type,
              },
            ),
        );
      }}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(err) => console.error(err)}
    />
  );
};