import { cn } from "@nextui-org/react";
import { ReactNode } from "react";

interface BodyAreaProps {
  children: ReactNode;
  className?: string;
}

const BodyArea = ({ children, className = "" }: BodyAreaProps) => {
  return (
    <div
      className={cn(
        "overflow-y-scroll h-full w-full",
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar scrollbar-w-[5px]",
        "scrollbar-thumb-gray-800/40 scrollbar-track-slate-300/30 dark:scrollbar-thumb-white/30 dark:scrollbar-track-white/20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default BodyArea;
