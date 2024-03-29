"use client";

import useModal from "@/hooks/useModal";
import DynamicModalWrapper, { DynamicModalBody } from "./modal-dynamic-wrapper";
import { TbPhoto } from "react-icons/tb";
import { SlPicture } from "react-icons/sl";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import useToken from "@/hooks/useToken";
import axios from "@/utils/axios-config";
import qs from "query-string";
import { useAppSelector } from "@/hooks/store";
import { Chat, Member } from "@/types";
import { useChat } from "@/hooks/use-chat";
import Image from "next/image";
import Avatar from "../avatar";
import { motion } from "framer-motion";
import { cn } from "@nextui-org/react";
import MembersMenu from "./modal-menu/members-menu";
import MembersList from "./common/members-list";
import { IoArrowBackOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import DynamicChatMenuButton from "./common/dynamic-chat-menu-button";
import DynamicModalHeader from "./common/dynamic-modal-header";
import { AnimatePresence } from "framer-motion";
import Delimiter from "./common/delimiter";

type Menu = "default" | "members" | "images";

const DynamicChatMenuModal = () => {
  const { chat } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Menu>("default");

  const { types, isOpen, onClose } = useModal();
  const token = useToken();
  const { selectedChat } = useAppSelector((store) => store.state);

  const isModalOpen = isOpen && types.includes("chatMenu");

  useEffect(() => {
    setCurrentMenu("default");
  }, [isModalOpen]);

  if (!chat) {
    return null;
  }

  return (
    <DynamicModalWrapper isOpen={isModalOpen} onClose={onClose}>
      <AnimatePresence>
        {currentMenu === "default" && (
          <InitialMenu
            onCrossClick={() => onClose()}
            setCurrentMenu={setCurrentMenu}
          />
        )}

        {currentMenu === "members" && (
          <MembersMenu
            onCloseClick={() => onClose()}
            onBackClick={() => setCurrentMenu("default")}
            members={chat.members}
          />
        )}
      </AnimatePresence>
    </DynamicModalWrapper>
  );
};

export default DynamicChatMenuModal;

interface InitialMenuProps {
  onCrossClick: () => void;
  setCurrentMenu: (menu: Menu) => void;
}
const InitialMenu = ({ setCurrentMenu, onCrossClick }: InitialMenuProps) => {
  const { chat } = useChat();
  if (!chat) {
    return null;
  }

  return (
    <>
      <DynamicModalHeader name="Name" onCloseClick={onCrossClick} />
      <DynamicModalBody>
        <HeadLine
          name={chat?.name}
          count={chat?.members.length}
          imageUrl={chat.imageUrl}
        />
        <Delimiter/>
        <div className="flex flex-col">
          <DynamicChatMenuButton name="1568 photos" Icon={<SlPicture />} />
          <DynamicChatMenuButton name="videos" Icon={<TbPhoto />} />
          <DynamicChatMenuButton name="files" />
          <DynamicChatMenuButton name="audio files" />
          <DynamicChatMenuButton name="shared links" />
          <DynamicChatMenuButton name="voice messages" />
          <DynamicChatMenuButton name="GIFs" />
        </div>
        <div className="bg-gray-6600/50 w-full h-[10px] "></div>
        <Delimiter/>
        <div
          onClick={() => setCurrentMenu("members")}
          className={cn(
            "w-full cursor-pointer hover:bg-gray-100 h-[40px] flex justify-left items-center text-gray-800"
          )}
        >
          
          <div className="ml-6 mr-8 flex justify-center text-[20px]  ">
            null
          </div>
          
          <p className="w-full text-[14px]  font-semibold">
            {chat.members.length} MEMBERS
          </p>
        </div>
        <MembersList members={chat.members} />
      </DynamicModalBody>
    </>
  );
};

interface HeadLineProps {
  name: string;
  count: number;
  imageUrl: string;
}
const HeadLine = ({ name, count, imageUrl }: HeadLineProps) => {
  return (
    <div className="h-[100px] flex items-center ">
      <Avatar
        imageUrl={imageUrl}
        name={name.charAt(0)}
        className="text-[50px] w-20 h-20 bg-black mx-5"
      />
      <div className="flex flex-col justify-center ">
        <p className="font-semibold text-[19px]">{name}</p>
        <p className="text-gray-400 font-light text-[14px]">{count} members</p>
      </div>
    </div>
  );
};
