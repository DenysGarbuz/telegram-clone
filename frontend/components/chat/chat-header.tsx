"use client";

import { ReactNode, useMemo, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { BsLayoutSidebarReverse } from "react-icons/bs";
import { MdLocalPhone } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { ChatType, Member } from "@/types";
import { useChat } from "@/hooks/use-chat";
import { AnimatePresence, easeIn, easeOut, motion } from "framer-motion";
import useModal from "@/hooks/useModal";
import MenuOption from "../menu-option";

interface ChatHeaderProps {
  name: string;
  members?: number;
  type?: ChatType;
  member: Member;
}

const ChatHeader = ({ name, type, members, member }: ChatHeaderProps) => {
  const {
    selectedMessages,
    chatMode,
    setSelectedMessages,
    setMessageInProccess,
    currentMessage,
  } = useChat();
  const { onOpen } = useModal();

  const count = selectedMessages.length;

  const handleCansel = () => {
    setSelectedMessages([]);
  };

  const handleOpenChatMenu = () => {
    onOpen("chatMenu");
  };

  const handleDeleteMessages = () => {
    if (currentMessage || selectedMessages.length > 0) {
      setMessageInProccess(currentMessage);
      onOpen("deleteMessage");
    }
  };

  if (chatMode === "selection") {
    const canDelete = !selectedMessages.some(
      (m) => m.member._id.toString() !== member._id.toString()
    );
    console.log("CANDELETE", canDelete);

    return (
      <motion.div className="h-[60px] w-full text-[14px] font-semibold  flex items-center justify-between  border-b-1 dark:border-r-2 dark:border-dark-200">
        <div className="">
          <SelectionModeButton name="FORWARD" count={count} />
          {canDelete && (
            <SelectionModeButton
              onClick={handleDeleteMessages}
              name="DELETE"
              count={count}
            />
          )}
        </div>
        <button
          onClick={handleCansel}
          className="text-light-200 brightness-95 hover:bg-light-200/10 p-2 mr-3  rounded-[0.28rem] "
        >
          CANCEL
        </button>
      </motion.div>
    );
  }

  return (
    <div className="h-[60px] w-full  flex border-b-1 dark:border-r-2 dark:border-dark-200">
      <div
        onClick={handleOpenChatMenu}
        className="flex-1 py-[7px] pl-[20px] cursor-pointer"
      >
        <h2 className="font-semibold text-[14px] ">{name}</h2>
        <p className="font text-[14px] text-gray-400 ">{members} members</p>
      </div>

      <div className="flex px-[3px]">
        <HeaderButton Icon={<IoIosSearch />} />
        <HeaderButton Icon={<MdLocalPhone />} />
        <HeaderButton Icon={<BsLayoutSidebarReverse />} />
        <PopOverMenu>
          <HeaderButton Icon={<HiDotsVertical />} />
        </PopOverMenu>
      </div>
    </div>
  );
};

export default ChatHeader;

const PopOverMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen } = useModal();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" onClick={handleClick}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ width: 150, height: 50, opacity: 0 }}
            animate={{ width: 210, height: "auto", opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute top-11 right-3 overflow-hidden bg-white shadow-md border-1 border-gray-50  z-30 rounded-[3px] pb-5 pt-5 "
          >
            <MenuOption
              onClick={() => onOpen("manageChat")}
              name="Manage Chat"
            />
            <MenuOption name="chat settings" />
            <MenuOption name="chat settings" />
            <MenuOption name="chat settings" />
            <MenuOption name="chat settings" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HeaderButtonProps {
  Icon: ReactNode;
  onClick?: () => void;
}
const HeaderButton = ({ Icon, onClick }: HeaderButtonProps) => {
  return (
    <div className="w-[43px] h-full flex justify-center items-center cursor-pointer text-gray-500 text-[22px]">
      {Icon}
    </div>
  );
};

const SelectionModeButton = ({
  name,
  count,
  onClick,
}: {
  name: string;
  count: number;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className=" relative bg-light-200 hover:brightness-[.98] ring-black/20 py-2 px-4 rounded-[0.28rem] ml-3 text-white "
    >
      {name} <span className="ml-2 text-gray-200">{count}</span>
    </button>
  );
};
