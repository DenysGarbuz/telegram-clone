"use client";
import { ReactNode, useEffect, useRef, useState } from "react";

import {
  AnimationControls,
  TargetAndTransition,
  Variants,
  motion,
} from "framer-motion";
import { cn } from "@nextui-org/react";

interface StaticModalWrapperProps {
  children: ReactNode;
  animation: Animation;
  onClose: () => void;
  isOpen: boolean;
}

type Animation = "slide" | "fade";
type AnimationConfig<V extends Animation> = {
  [K in V | "final"]: TargetAndTransition | AnimationControls;
} & Variants;

const variants: AnimationConfig<Animation> = {
  final: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      type: "tween",
    },
  },
  slide: { x: 90, opacity: 0 },
  fade: { x: 0, opacity: 0 },
};

const StaticModalWrapper = ({
  children,
  animation,
  onClose,
  isOpen,
}: StaticModalWrapperProps) => {
  const modalDiv = useRef<HTMLDivElement>(null);


  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalDiv.current && !modalDiv.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return isOpen ? (
    <div
      onClick={handleClick}
      className="flex absolute inset-0 w-full h-full justify-center items-center  z-[4]"
    >
      <motion.div
        ref={modalDiv}
        className={cn(
          " z-[5] shadow-md shadow-black/20 rounded-lg bg-white dark:bg-dark-100 flex flex-col max-h-full pdx-[3px] pb-[15px] "
        )}
        variants={variants}
        initial={animation}
        animate="final"
      >
        {children}
      </motion.div>
    </div>
  ) : null;
};

export default StaticModalWrapper;
