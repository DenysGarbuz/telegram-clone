"use client";

import { useEffect, useState } from "react";
import CreateChatModal from "../modals/create-chat-modal";
import useModal from "@/hooks/useModal";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { cn } from "@nextui-org/react";
import DeleteGroupModal from "../modals/delete-group-modal";
import LeaveChatModal from "../modals/leave-chat-modal";

import ManageChatModal from "../modals/manage-chat-modal";
import DeleteMessageModal from "../modals/delete-message-modal";
import SendFileModal from "../modals/send-file-modal";
import DynamicChatMenuModal from "../modals/dynamic-chat-menu-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { types } = useModal();
  const { menuOpen } = useAppSelector((store) => store.state);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) null;

  return (
    <>
      <BackdropShadow isActive={menuOpen || types.length > 0} />
      <CreateChatModal />
      <DeleteGroupModal />
      <LeaveChatModal />
      <DynamicChatMenuModal />
      <ManageChatModal />
      <DeleteMessageModal />
      {/* <SendFileModal /> */}
    </>
  );
};

export default ModalProvider;

function BackdropShadow({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn(
        "absolute left-0 z-[2] top-0 w-full h-full transition bg-black/40 pointer-events-none",
        isActive ? "opacity-100" : "opacity-0"
      )}
    />
  );
}
