"use client";

import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { FileIcon, X } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";

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
  const isPdf = value && /\.(pdf)$/i.test(value);
  const isAudio = value && /\.(mp3|wav)$/i.test(value);
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

  if (isPdf)
    return (
      <div
        className={
          "relative mt-2 flex items-center rounded-md bg-background/10 p-2"
        }
      >
        <FileIcon className={"h-10 w-10 fill-indigo-200 stroke-indigo-400"} />
        <a
          href={value}
          target={"_blank"}
          rel={"noopener noreferrer"}
          className={
            "darK:text-indigo-400 ml-2 text-sm font-medium text-indigo-500 hover:underline"
          }
        >
          {value}
        </a>
        <button
          onClick={async () => {
            await deleteValue();
            onChange("");
          }}
          className={
            "absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          }
          type={"button"}
        >
          <X className={"h-4 w-4"} />
        </button>
      </div>
    );

  if (isAudio)
    return (
      <div
        className={
          "relative mt-2 flex items-center rounded-md bg-background/10 p-2"
        }
      >
        <AudioPlayer src={value} />
        <button
          onClick={async () => {
            await deleteValue();
            onChange("");
          }}
          className={
            "absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
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
            new File([f], `${uuidv4()}-${f.name.replace(/\s/g, "_")}`, {
              type: f.type,
            }),
        );
      }}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(err) => console.error(err)}
    />
  );
};
