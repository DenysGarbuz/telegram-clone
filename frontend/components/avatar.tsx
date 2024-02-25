import { cn } from "@nextui-org/react";
import Image from "next/image";

interface AvatarProps {
  name: string;
  imageUrl: string;
  className?: string;
}

const Avatar = ({ name, imageUrl, className }: AvatarProps) => {
  return (
    <div
      className={cn(
        "text-white relative overflow-hidden capitalize rounded-full flex justify-center items-center ",
        className
      )}
    >
      {imageUrl ? <Image src={imageUrl} fill alt="member image" /> : name}
    </div>
  );
};

export default Avatar;
