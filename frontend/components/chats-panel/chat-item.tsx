"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { Avatar, cn } from "@nextui-org/react";
import { actions } from "@/store/state/stateSlice";

interface ChatItemProps {
  name: string;
  lastMessage: { author: string; text: string };
  imageUrl?: string;
  chatId: string;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

const ChatItem = ({
  name,
  lastMessage,
  imageUrl,
  chatId,
  onContextMenu,
  onClick,
}: ChatItemProps) => {
  const { selectedChat } = useAppSelector((store) => store.state);

  return (
    <div
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={cn(
        "flex w-full h-[66px] cursor-pointer items-center p-2",
        selectedChat?.id === chatId && "bg-light-200 dark:bg-dark-300 ",
        selectedChat?.id !== chatId &&
          "hover:bg-gray-200/70 dark:hover:bg-white/5"
      )}
    >
      <Avatar
        alt="group image"
        className="w-12 h-12 text-2xl text-white mr-4 bg-black transition-none"
        src={imageUrl}
        name={name.charAt(0).toUpperCase()}
      />
      <div className="flex flex-col  h-full ">
        <p className="font-semibold text-sm mb-2">{name}</p>
        <p className="font-normal text-sm text-gray-500">
          {lastMessage.author}
          {lastMessage.text}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
