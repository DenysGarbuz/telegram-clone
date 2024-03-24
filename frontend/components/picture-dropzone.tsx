import { cn } from "@nextui-org/react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { MdCameraAlt } from "react-icons/md";

interface PictureDropzoneProps {
  setImage: (image: File) => void;
  image: string | null;
  className?: string;
}

const PictureDropzone = ({
  image,
  setImage,
  className,
}: PictureDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
    console.log(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: true,
    maxFiles: 1,
    accept: { "image/jpg": [".jpg", ".jpeg"] },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="">
      <div
        {...getRootProps()}
        className={cn(
          "rounded-full bg-light-200 m-auto flex items-center justify-center text-white text-[41px] hover:bg-light-200/90 cursor-pointer relative ",
          className,
          !className && "w-[80px] h-[80px]"
        )}
      >
        <input {...getInputProps()} />
        {image ? (
          <Image
            alt="image"
            src={image}
            fill
            className="rounded-full"
          />
        ) : (
          <MdCameraAlt />
        )}
      </div>
    </div>
  );
};

export default PictureDropzone;
