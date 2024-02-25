"use client";
import useModal from "@/hooks/useModal";
import StaticModalWrapper from "./static-modal-wrapper";
import FooterButton from "./common/footer-button";
import { Checkbox } from "@nextui-org/react";
import axios from "@/utils/axios-config";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { actions } from "@/store/state/stateSlice";
import { headers } from "next/headers";
import useToken from "@/hooks/useToken";
import { useChat } from "@/hooks/use-chat";
import { useSocket } from "../providers/socket-provider";

const DeleteMessageModal = () => {
  const { isOpen, onClose, types } = useModal();
  const isModalOpen = isOpen && types.includes("deleteMessage");

  const { selectedChat } = useAppSelector((store) => store.state);
  const dispatch = useAppDispatch();
  const { selectedMessages, messageInProcess, setChatMode } = useChat();
  const { socket } = useSocket();

  const handleMessageDelete = async () => {
    const messageIds =
      selectedMessages.length > 0
        ? selectedMessages.map((m) => m._id)
        : [messageInProcess?._id];
    try {
      socket?.emit("message:delete", { chatId: selectedChat?.id, messageIds });
      setChatMode("default");
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <StaticModalWrapper animation="fade" onClose={onClose} isOpen={isModalOpen}>
      <div className="h-[190px] w-[340px] flex-grow flex flex-col text-gray-1000">
        <div className="h-full w-full pt-[45px] pl-[25px] pr-[50px] row">
          <p>Are you sure you want to leave this group?</p>
          <div className="mt-[20px]">
            <Checkbox radius="sm" disableAnimation>
              Delete for everyone
            </Checkbox>
          </div>
        </div>
        <div className="h-[50px] w-full flex justify-end">
          <FooterButton onClick={onClose} name="Cancel" />
          <FooterButton
            onClick={handleMessageDelete}
            className="text-red-500 hover:bg-red-100"
            name="Delete"
          />
        </div>
      </div>
    </StaticModalWrapper>
  );
};

export default DeleteMessageModal;
