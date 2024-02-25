"use client";

import ChatBody from "@/components/chat/chat-body";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatJoinButton from "@/components/chat/chat-join-button";
import LoadingSpinner from "@/components/loading-spinner";
import { useSocket } from "@/components/providers/socket-provider";
import { useAppSelector } from "@/hooks/store";
import { useChat } from "@/hooks/use-chat";
import useChatSocket from "@/hooks/use-chat-socket";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Chat } from "@/types";
import axios from "@/utils/axios-config";
import ObjectId from "bson-objectid";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const { isLoading, user, token, isError } = useCurrentUser();
  const { selectedChat, chatsRefresh } = useAppSelector((store) => store.state);
  const { chat, setChat } = useChat();

  useEffect(() => {
    setChat(null);
    const fetchChat = async () => {
      try {
        const { data } = await axios.get(`/api/chats/${selectedChat?.id}`, {
          headers: { Authorization: "Bearer " + token },
        });
        setChat(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user && selectedChat) {
      fetchChat();
    }
  }, [user, selectedChat]);

  const { isMember, member } = useMemo(() => {
    const member = chat?.members?.find(
      (member) => member.userId._id === user?._id
    );
    console.log("MEMBER", member);
    const isMember = !!member;
    //const isAdmin...

    return { isMember, member };
  }, [chat, selectedChat]);

  // if (isError) {
  //   alert("ERROR");
  // }

  if (!selectedChat) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white font-semibold px-4 py-1 rounded-full bg-black/10 text-[14px]">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  if (isLoading || !chat) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="h-[60px] w-full border-b-1 dark:border-r-2 dark:border-dark-200"></div>
        <div className=" flex-1 w-full bg-green-100"></div>
        <ChatInput chatId={selectedChat.id} member={member} />
      </div>
    );
  }

  console.log(chat);
  console.log("ismember", isMember);

  return (
    <div className="w-full h-full flex flex-col ">
      <ChatHeader
      member={member}
        type={chat?.type}
        members={chat?.members.length}
        name={chat.name}
      />

      <ChatBody
        selectedChat={selectedChat}
        chat={chat}
        member={member}
        user={user}
      />
      {isMember ? (
        <ChatInput chatId={chat._id} member={member} user={user} />
      ) : (
        <ChatJoinButton chatType="GROUP" chatId={chat._id} />
      )}
    </div>
  );
}
