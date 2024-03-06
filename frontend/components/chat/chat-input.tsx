"use client";

import { Textarea, cn } from "@nextui-org/react";
import React, {
  ChangeEvent,
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { PiMicrophone } from "react-icons/pi";
import { PiSmiley } from "react-icons/pi";
import { useSocket } from "../providers/socket-provider";
import { Member, Message, User } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useChat } from "@/hooks/use-chat";
import { IoArrowUndo } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { extractNameOrEmail } from "@/utils/messages";
import { IoSend } from "react-icons/io5";

import { useDropzone } from "react-dropzone";
import useModal from "@/hooks/useModal";
import SendFileModal from "../modals/send-file-modal";
import { sendMessage } from "@/utils/messages";

interface ChatInputProps {
  chatId: string;
  member: Member;
  user: User;
}

const ChatInput = ({ chatId, member, user }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<null | File[]>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { socket } = useSocket();
  const { onOpen, types, isOpen } = useModal();
  const { chatMode, messageInProcess, setChatMode } = useChat();
  const queryClient = useQueryClient();

  useEffect(() => {
    inputRef.current?.focus();
    if (chatMode === "edit") {
      setText(messageInProcess?.text ?? "");
    }
  }, [chatMode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setText(text);
  };

  const handleFilesSet = async (files: File[]) => {
    console.log(files);
    setFiles(files);
    onOpen("sendImage");
  };

  const handleEditMessage = () => {
    socket?.emit("message:edit", {
      messageId: messageInProcess?._id,
      text,
      chatId,
    });
  };

  const handleCancel = () => {
    setChatMode("default");
    setText("");
  };

  const handlePressEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessage();
    }
  };

  const handleMessage = () => {
    switch (chatMode) {
      case "edit":
        handleEditMessage();
        break;
      default:
        sendMessage({
          chatId,
          files,
          member,
          text,
          user,
          socket,
          chatMode,
          queryClient,
          messageInProcess,
        });
    }
    setChatMode("default");
    setText("");
  };

  return (
    <div>
      <SendFileModal
        onClose={() => setFiles(null)}
        onSendClick={handleMessage}
        files={files}
      />
      {chatMode === "reply" && (
        <div className="h-[52px] flex cursor-pointer border-t-1 dark:border-r-2 dark:border-dark-200">
          <div className="flex justify-center text-light-200 items-center text-[25px] w-[58px]">
            <IoArrowUndo />
          </div>
          <div className="flex flex-col flex-1 justify-center">
            <p className=" text-sky-600 text-[14px] font-medium">
              {extractNameOrEmail(messageInProcess)}
            </p>
            <p className="text-[14px]">{messageInProcess?.text}</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-[22px] flex justify-center items-center text-gray-400 w-[58px]"
          >
            <RxCross2 />
          </button>
        </div>
      )}
      {chatMode === "edit" && (
        <div className="h-[52px] flex cursor-pointer border-t-1 dark:border-r-2 dark:border-dark-200">
          <div className="flex justify-center text-light-200 items-center text-[25px] w-[58px]">
            <MdModeEditOutline />
          </div>
          <div className="flex flex-col flex-1 justify-center">
            <p className=" text-sky-600 text-[14px] font-medium">
              Edit message
            </p>
            <p className="text-[14px]">{messageInProcess?.text}</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-[22px] flex justify-center items-center text-gray-400 w-[58px]"
          >
            <RxCross2 />
          </button>
        </div>
      )}
      <div
        className={cn("w-full items-center flex  dark:border-dark-200", {
          "border-t-1 dark:border-r-2": chatMode === "default",
        })}
      >
        <Dropzone onFilesSet={(files) => handleFilesSet(files)}>
          <InputButton Icon={<AiOutlinePaperClip />} className="text-[28px]" />
        </Dropzone>
        <Textarea
          onKeyDown={(e) => handlePressEnter(e)}
          ref={inputRef}
          onChange={handleChange}
          className=""
          minRows={1}
          value={text}
          placeholder="Write a message..."
          classNames={{
            inputWrapper: " shadow-none rounded-none px-2",
            input: " scrollbar-none",
          }}
          maxRows={10}
        />
        <InputButton Icon={<PiSmiley />} className="text-[28px]" />
        {text.length > 0 ? (
          <InputButton
            onClick={handleMessage}
            Icon={<IoSend />}
            className="text-sky-500 text-[23px] brightness-95"
          />
        ) : (
          <InputButton Icon={<PiMicrophone />} className="text-[28px]" />
        )}
      </div>
    </div>
  );
};

export default ChatInput;

interface DropzoneProps {
  onFilesSet: (files: File[]) => void;
  className?: string;
  children: React.ReactNode;
}
const Dropzone = ({ onFilesSet, className, children }: DropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSet(acceptedFiles);
    console.log("ACCEPTED_FILES", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: true,
    maxFiles: 8,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
    </div>
  );
};

interface InputButtonProps {
  Icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}
const InputButton = ({
  Icon,
  onClick,
  className,
  children,
}: InputButtonProps) => {
  return (
    <div
      className={cn(
        "h-full w-[58px] flex flex-col justify-end items-center bg-white"
      )}
    >
      {children}
      <div
        onClick={onClick}
        className={cn(
          " w-full h-[52px] flex justify-center items-center  cursor-pointer text-gray-400",
          className
        )}
      >
        {Icon}
      </div>
    </div>
  );
};
