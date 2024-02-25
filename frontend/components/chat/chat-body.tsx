"use client";
import useToken from "@/hooks/useToken";
import { Chat, Member, Message, SelectedChat, User } from "@/types";
import axios from "@/utils/axios-config";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LoadingSpinner from "../loading-spinner";
import useChatSocket from "@/hooks/use-chat-socket";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import qs from "query-string";
import { useChatQuery } from "@/hooks/use-chat-query";
import { cn, divider } from "@nextui-org/react";
import moment from "moment";
import { LuClock3 } from "react-icons/lu";
import { IoCheckmarkOutline } from "react-icons/io5";
import Image from "next/image";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import MessageContextMenu from "./chat-message-context-menu";
import { useChat } from "@/hooks/use-chat";
import { extractNameOrEmail } from "@/utils/messages";
import { FaCheck } from "react-icons/fa6";
import BodyMessage from "./chat-mesasge";
import { useDropzone } from "react-dropzone";

interface ChatBodyProps {
  selectedChat: SelectedChat;
  member: Member | undefined;
}

const ChatBody = ({ selectedChat, member }: ChatBodyProps) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { setCurrentMessage, selectedMessages, setSelectedMessages, chatMode } =
    useChat();

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const { isFetching, data, fetchNextPage, hasNextPage } = useChatQuery({
    selectedChat,
  });
  useChatSocket(selectedChat);
  useChatScroll({
    chatBodyRef,
    chatBottomRef,
    lastMessageOwner: data?.pages[0].messages[0]?.member._id === member?._id,
    count: data?.pages[0].messages.length ?? 0,
    loadMore: fetchNextPage,
    hasMoreMessages: hasNextPage,
    isFetching,
  });

  const onContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    setCurrentMessage(message);

    setCursorPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
    setCurrentMessage(null);
  };

  const handleSelectionModeClick = (message: Message) => {
    const isAlreadySelected = selectedMessages.some(
      (sm) => sm._id === message._id
    );
    if (isAlreadySelected) {
      setSelectedMessages(
        selectedMessages.filter((sm) => sm._id !== message._id)
      );
    } else {
      setSelectedMessages([...selectedMessages, message]);
    }
  };

  return (
    <div
      ref={chatBodyRef}
      className="overflow-y-auto flex flex-col flex-1 scrollbar-none bg-green-200 "
    >
      <MessageContextMenu
        cursorPosition={cursorPosition}
        isOpen={showContextMenu}
        onClose={handleCloseContextMenu}
      />
      <div className="w-full flex flex-col-reverse justify-end z-[1] ">
        {data?.pages.map(({ messages }, i) => (
          <Fragment key={i}>
            {messages.map((message, i) => (
              <BodyMessage
                onClick={
                  chatMode === "selection"
                    ? () => handleSelectionModeClick(message)
                    : undefined
                }
                key={message._id}
                message={message}
                isOwner={member ? message.member._id === member._id : false}
                prevMessage={i - 1 >= 0 ? messages[i - 1] : null}
                nextMessage={i + 1 < messages.length ? messages[i + 1] : null}
                onContextMenu={(e) => onContextMenu(e, message)}
                isSelected={selectedMessages.some((m) => m._id === message._id)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <button
        onClick={() => {
          chatBodyRef.current?.scrollTo({ top: 200, behavior: "smooth" });
        }}
      >
        click
      </button>
      <div ref={chatBottomRef} />
    </div>
  );
};

export default ChatBody;

interface DropzoneProps {
  onImageSet: (image: File) => void;
  className?: string;
  children: React.ReactNode;
}

const Dropzone = ({ onImageSet, className, children }: DropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    onImageSet(file);
    console.log(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: { "image/jpg": [".jpg", ".jpeg"] },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className=" bg-black">
      {children}
      <div {...getRootProps()} className={cn(" ")}>
        <input {...getInputProps()} />
      </div>
      {isDragActive && (
        <div className="absolute top-0 bottom-0 right-0 left-0 bg-red-500/50"></div>
      )}
    </div>
  );
};
