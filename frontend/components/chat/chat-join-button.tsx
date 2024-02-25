"use client";

import useToken from "@/hooks/useToken";
import { useEffect, useState } from "react";
import axios from "@/utils/axios-config";
import { useAppDispatch } from "@/hooks/store";
import { actions } from "@/store/state/stateSlice";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface ChatJoinButtonProps {
  chatId: string;
  chatType: string;
}

const ChatJoinButton = ({ chatType, chatId }: ChatJoinButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const token = useToken();

  const handleJoinClick = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `/api/chats/join/${chatId}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(actions.chatsRefresh());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer border-t-1 dark:border-r-2 dark:border-dark-200 hover:bg-gray-100 w-full h-[52px] text-[14px] flex justify-center items-center capitalize text-sky-600 font-semibold"
      )}
    >
      <button
        onClick={handleJoinClick}
        disabled={isLoading}
        className="w-full h-full"
      >
        JOIN {chatType}
      </button>
    </div>
  );
};

export default ChatJoinButton;
