"use client";

import {
  AnimationControls,
  TargetAndTransition,
  Variants,
  motion,
} from "framer-motion";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@nextui-org/react";
import { debounce } from "lodash";
import useModal from "@/hooks/useModal";

const PADDING_SIZE = 28;

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

type Modal = {};

interface DynamicModalWrapperProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  animation: Animation;
  header?: ReactNode;
}
const DynamicModalWrapper = ({
  children,
  animation,
  header,
  onClose,
  isOpen,
}: DynamicModalWrapperProps) => {
  const { types } = useModal();
  const [padding, setPadding] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const modalDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = modalDiv.current;
    //rewrite later
    if (current) {
      const scrolling =
        current.getBoundingClientRect().bottom === window.innerHeight;
      setIsScrolling(scrolling);
    }
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalDiv.current && !modalDiv.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return isOpen ? (
    <motion.div
      onClick={handleClick}
      className={cn(
        "absolute w-full h-full z-[4] ",

        "pt-[40px]"
      )}
      animate={{
        paddingBottom: padding,
        transition: {
          duration: 0.1,
          type: "tween",
        },
      }}
    >
      <motion.div
        ref={modalDiv}
        className={cn(
          "w-[438px]  shadow-md relative  overflow-hidden shadow-black/20 mx-auto rounded-t-lg bg-white dark:bg-dark-100 flex flex-col max-h-full px-[3px] pb-[15px] border-white dark:border-dark-100",
          !isScrolling && "rounded-b-lg",
          padding > 0 && "rounded-b-lg"
        )}
        variants={variants}
        initial={animation}
        animate="final"
      >
        {types.length > 1 && (
          <div className="inset-0 absolute w-full h-full bg-black/30" />
        )}
        {header && <ModalHeader>{header}</ModalHeader>}
        <ModalBody setPadding={setPadding} isOpen={isOpen}>
          {children}
        </ModalBody>
      </motion.div>
    </motion.div>
  ) : null;
};

export default DynamicModalWrapper;

const ModalHeader = ({ children }: { children: ReactNode }) => {
  return <div className="h-[80px] w-full">{children}</div>;
};

interface ModalBodyProps {
  children: ReactNode;
  setPadding: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
}

const ModalBody = ({ children, setPadding, isOpen }: ModalBodyProps) => {
  const scrollableDiv = useRef<HTMLDivElement>(null);
  //if dynamic make padding ofter scrolling bottom
  useEffect(() => {
    const current = scrollableDiv.current;
    const handleScroll = debounce(() => {
      if (current) {
        const { scrollTop, scrollHeight, clientHeight } = current;
        const spaceLeft = Math.max(scrollHeight - scrollTop - clientHeight, 0);

        if (spaceLeft >= PADDING_SIZE) {
          setPadding(0);
        }

        if (spaceLeft < PADDING_SIZE) {
          setPadding(Math.abs(PADDING_SIZE - spaceLeft));
        }
      }
    }, 16);

    if (current) {
      current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen]);

  return (
    <div
      ref={scrollableDiv}
      className={cn(
        "overflow-y-scroll h-full transition duration-200",
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar scrollbar-w-[5px]",
        "scrollbar-thumb-gray-800/40 scrollbar-track-slate-300/30 dark:scrollbar-thumb-white/30 dark:scrollbar-track-white/20"
      )}
    >
      {children}
    </div>
  );
};
