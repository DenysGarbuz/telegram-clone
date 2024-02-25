"use client";

import { ReactNode, RefObject, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GoReply, GoPencil } from "react-icons/go";
import { PiPushPinLight } from "react-icons/pi";
import { MdContentCopy } from "react-icons/md";
import { IoReturnUpForward, IoCheckmarkCircleOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";

import useModal from "@/hooks/useModal";
import { cn } from "@nextui-org/react";
import MenuOption from "../menu-option";
import { Message } from "@/types";
import { useChat } from "@/hooks/use-chat";

interface MessageContextMenuProps {
  cursorPosition: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
}

const MessageContextMenu = ({
  cursorPosition,
  isOpen,
  onClose,
}: MessageContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { onOpen } = useModal();
  const {
    setSelectedMessages,
    currentMessage,
    setChatMode,
    selectedMessages,
    setMessageInProccess,
  } = useChat();

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

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentMessage?.text ?? "");
  };

  const handleSelectMessage = () => {
    currentMessage && setSelectedMessages([currentMessage]);
  };

  const handleReplyMessage = () => {
    currentMessage && setChatMode("reply");
  };

  const handleEditMessage = () => {
    currentMessage && setChatMode("edit");
  };

  const handleDeleteMessage = () => {
    if (currentMessage || selectedMessages.length > 0) {
      setMessageInProccess(currentMessage);
      onOpen("deleteMessage");
    }
  };

  return (
    <motion.div
      onClick={onClose}
      ref={ref}
      className=" absolute  overflow-hidden bg-white shadow-md z-30 rounded-[3px] border-b-5 border-t-5 border-white"
      style={{ top: cursorPosition.y, left: cursorPosition.x }}
      initial={{ width: 150, height: 50, opacity: 0 }}
      animate={{ width: 210, height: "auto", opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <MenuOption
        name="Reply"
        Icon={<GoReply />}
        onClick={handleReplyMessage}
      />
      <MenuOption name="Edit" Icon={<GoPencil />} onClick={handleEditMessage} />
      <MenuOption
        name="Pin"
        Icon={<PiPushPinLight />}
        onClick={() => onOpen("leaveChat")}
      />
      <MenuOption
        name="Copy Text"
        Icon={<MdContentCopy />}
        onClick={handleCopyText}
      />
      <MenuOption
        name="Forward"
        Icon={<IoReturnUpForward />}
        onClick={() => onOpen("leaveChat")}
      />
      <MenuOption
        name="Delete"
        Icon={<GoTrash />}
        onClick={handleDeleteMessage}
      />
      <MenuOption
        name="Select"
        Icon={<IoCheckmarkCircleOutline />}
        onClick={handleSelectMessage}
      />
    </motion.div>
  );
};

export default MessageContextMenu;
