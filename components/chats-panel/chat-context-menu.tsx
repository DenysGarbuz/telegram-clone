"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GoTrash } from "react-icons/go";
import { IoExitOutline } from "react-icons/io5";

import useModal from "@/hooks/useModal";
import MenuOption from "../menu-option";

interface ChatContextMenuProps {
  cursorPosition: { x: number; y: number };
  ref?: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose: () => void;
}

const ChatContextMenu = ({
  cursorPosition,
  isOpen,
  onClose,
}: ChatContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { onOpen } = useModal();

  useEffect(() => {
    const handleClickOutsideContextMenu = (e: any) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutsideContextMenu);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideContextMenu);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideContextMenu);
    };
  }, [isOpen, ref]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      onClick={onClose}
      ref={ref}
      className="absolute bg-white shadow-md z-30 rounded-[3px] overflow-hidden border-b-5 border-t-5 border-white"
      style={{ top: cursorPosition.y, left: cursorPosition.x }}
      initial={{ width: 150, height: 50, opacity: 0 }}
      animate={{ width: 210, height: "auto", opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <MenuOption
        name="Delete chat"
        classNames="text-red-500"
        Icon={<GoTrash />}
        onClick={() => onOpen("deleteGroup")}
      />
      <MenuOption
        name="Leave chat"
        classNames="text-red-500"
        Icon={<IoExitOutline />}
        onClick={() => onOpen("leaveChat")}
      />

      <MenuOption />
      <MenuOption />
      <MenuOption />
      <MenuOption />
      <MenuOption />
    </motion.div>
  );
};

export default ChatContextMenu;
