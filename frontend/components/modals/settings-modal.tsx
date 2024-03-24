"use client";

import useModal from "@/hooks/useModal";
import DynamicModalWrapper, { DynamicModalBody } from "./modal-dynamic-wrapper";
import DynamicModalHeader from "./common/dynamic-modal-header";
import DynamicChatMenuButton from "./common/dynamic-chat-menu-button";
import PictureDropzone from "../picture-dropzone";
import { useEffect, useState } from "react";
import axiosConfig from "@/utils/axios-config";
import useToken from "@/hooks/useToken";
import { useAppSelector } from "@/hooks/store";
import { Chat, User } from "@/types";
import {
  InfoSettingsMenu,
  InitialSettingsMenu,
} from "./modal-menu/settings-menu";
type Menu = "default" | "info";

const SettingsModal = () => {
  const { types, isOpen, onClose } = useModal();
  const isModalOpen = isOpen && types.includes("settings");
  const [currentMenu, setCurrentMenu] = useState<Menu>("default");

  // const [chat, setChat] = useState<User | null>(null);
  // const { selectedChat, chatsRefresh } = useAppSelector((store) => store.state);
  // const token = useToken();

  // useEffect(() => {
  //   setChat(null);
  //   const fetchChat = async () => {
  //     try {
  //       const { data } = await axiosConfig.get(
  //         `/api/users/`,
  //         {
  //           headers: { Authorization: "Bearer " + token },
  //         }
  //       );
  //       setChat(data);

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (selectedChat) {
  //     fetchChat();
  //   }
  // }, [selectedChat, isModalOpen]);

  useEffect(() => {
    setCurrentMenu("default");
  }, [isModalOpen]);

  return (
    <DynamicModalWrapper
      animation="slide"
      isOpen={isModalOpen}
      onClose={onClose}
    >
      {currentMenu == "default" && (
        <InitialSettingsMenu
          onCloseClick={onClose}
          onInfoClick={() => setCurrentMenu("info")}
        />
      )}
      {currentMenu == "info" && (
        <InfoSettingsMenu
          onCloseClick={onClose}
          onBackClick={() => setCurrentMenu("default")}
        />
      )}
    </DynamicModalWrapper>
  );
};

export default SettingsModal;
