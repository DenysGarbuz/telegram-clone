"use client";

import { motion } from "framer-motion";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@nextui-org/react";
import { throttle } from "lodash";
import useModal from "@/hooks/useModal";

const PADDING_SIZE = 28;

const variants = {
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

interface TestP {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
}
const Test = ({ children, onClose, isOpen }: TestP) => {
  const { types } = useModal();
  const [isScrolling, setIsScrolling] = useState(false);
  const modalDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = modalDiv.current;

    if (!current) return;

    const observer = new ResizeObserver(
      throttle((entries: ResizeObserverEntry[]) => {
        const scrolling =
          current.getBoundingClientRect().bottom === window.innerHeight;
        setIsScrolling(scrolling);
      }, 16)
    );

    observer.observe(modalDiv.current);

    return () => {
      observer.disconnect();
    };
  }, [modalDiv.current]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalDiv.current && !modalDiv.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return isOpen ? (
    <motion.div
      onClick={handleClose}
      className={cn("absolute w-full h-full z-[4] bg-black/20", "pt-[40px]")}
    >
      <motion.div
        ref={modalDiv}
        className={cn(
          "w-[438px] pb-3   relative  overflow-hidden shadow-black/20 mx-auto rounded-t-lg bg-white dark:bg-dark-100 flex flex-col max-h-full px-[3px]  border-white dark:border-dark-100",
          !isScrolling && "rounded-b-lg"
        )}
        variants={variants}
        initial="fade"
        animate="final"
      >
        {types.length > 1 && (
          <div className="inset-0 absolute w-full h-full bg-black/30" />
        )}
        {children}
      </motion.div>
    </motion.div>
  ) : null;
};

export default Test;

export const DynamicModalBody = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<null | number>(null);
  const [initialHeight, setInitialHeight] = useState<undefined | number>(500);

  useEffect(() => {
    const current = scrollableDiv.current;
    setInitialHeight(current?.clientHeight);

    const handleScroll = throttle(() => {
      if (current) {
        const { scrollTop, scrollHeight, clientHeight } = current;
        const spaceLeft = Math.max(scrollHeight - scrollTop - clientHeight, 0);

        if (spaceLeft >= PADDING_SIZE) {
          setHeight(null);
        }

        if (spaceLeft < PADDING_SIZE) {
          setHeight(
            Math.abs((initialHeight as number) - (PADDING_SIZE - spaceLeft))
          );
        }
      }
    }, 5);

    if (current) {
      current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollableDiv.current]);

  return (
    <motion.div
      animate={{
        height: height || undefined,
        transition: {
          duration: 0.1,
          type: "just",
        },
      }}
      ref={scrollableDiv}
      className={cn(
        "overflow-y-scroll ",
        "scrollbar-thumb-rounded-full scrollbar-track-rounded-full hover:scrollbar scrollbar-w-[5px]",
        "scrollbar-thumb-gray-800/40 scrollbar-track-slate-300/30 dark:scrollbar-thumb-white/30 dark:scrollbar-track-white/20"
      )}
    >
      {children}
    </motion.div>
  );
};
