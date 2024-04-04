'use client';

import { File, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
import '@uploadthing/react/styles.css'
import Image from "next/image";

interface FileUploadProps {
  onChange: (url: string) => void;
  value: string;
  endPoint: 'serverImage' | 'messageFile'
}

const FileUpload = ({
  onChange, value, endPoint
}: FileUploadProps) => {

  const fileType = value.split(".").pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className=" relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className=" rounded-full"
        />
        <button
          type="button"
          onClick={() => onChange('')}
          className=" bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X className=" h-4 w-4" />
        </button>
      </div>
    )
  }
  if (value && fileType === 'pdf') {
    return (
      <div className=" relative flex items-center justify-center rounded-md p-2 mt-2 bg-background/10">
        <File className=" w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm line-clamp-1 text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          type="button"
          onClick={() => onChange('')}
          className=" bg-rose-500 text-white p-1 rounded-full absolute -top-1 -right-1 shadow-sm"
        >
          <X className=" h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={({ message }) => console.log(message)}
    >

    </UploadDropzone>
  );
}

export default FileUpload;