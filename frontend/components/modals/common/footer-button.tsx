"use client";

import { cn } from "@nextui-org/react";

interface FooterButtonProps {
  onClick?: () => void;
  name: string;
  className?: string;
}

const FooterButton = ({ onClick, name, className = "" }: FooterButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 rounded-[3px] h-[35px]  text-light-200 brightness-95 font-semibold text-[15px] hover:bg-sky-100/50",
        className
      )}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default FooterButton;
