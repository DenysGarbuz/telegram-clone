import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, SelectedChat } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

interface ChatSocketProps {}

const useChatSocket = (selectedChat: SelectedChat | null) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (isConnected && selectedChat) {
      socket?.emit("joining", selectedChat?.id);
    }
  }, [isConnected, selectedChat]);

  useEffect(() => {
    socket?.on("joined", (joinedChatid) => {
      if (socket.currentChatId && joinedChatid !== socket.currentChatId) {
        socket.emit("leaving", socket.currentChatId);
      }
      socket.currentChatId = joinedChatid;
    });
    console.log(socket?.currentChatId);

    socket?.on(
      "message:add",
      ({ newMessage, fakeId }: { newMessage: Message; fakeId: string }) => {
        const isOwner = newMessage.member.userId._id === user?._id;

        console.log("isOwnerOfMessage", isOwner);

        queryClient.setQueryData(
          ["messages", selectedChat?.id],
          (oldData: any) => {
            let newPages = [...oldData.pages];

            if (isOwner) {
              newPages = newPages.map((page) => ({
                ...page,
                messages: page.messages.map((message: Message) => {
                  if (message._id === fakeId) {
                    return {
                      ...message,
                      _id: newMessage._id,
                      createdAt: newMessage.createdAt,
                      updatedAt: newMessage.updatedAt,
                      loaded: true,
                    };
                  }
                  return message;
                }),
              }));
            } else {
              newPages[0] = {
                ...newPages[0],
                messages: [newMessage, ...newPages[0].messages],
              };
            }

            return {
              ...oldData,
              pages: newPages,
            };
          }
        );

        console.log("adding message", newMessage);
        console.log(
          "messages",
          queryClient.getQueryData(["messages", selectedChat?.id])
        );
      }
    );

    socket?.on("message:edit", (editedMessage: Message) => {
      const isOwner = editedMessage.member.userId._id === user?._id;

      console.log("isOwnerOfMessage", isOwner);

      queryClient.setQueryData(
        ["messages", selectedChat?.id],
        (oldData: any) => {
          let newPages = [...oldData.pages];

          newPages = newPages.map((page) => ({
            ...page,
            messages: page.messages.map((message: Message) => {
              if (message._id === editedMessage._id) {
                return {
                  ...message,
                  updatedAt: editedMessage.updatedAt,
                  text: editedMessage.text,
                  loaded: true,
                };
              }
              return message;
            }),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      console.log("edited message", editedMessage);
      console.log(
        "messages",
        queryClient.getQueryData(["messages", selectedChat?.id])
      );
    });

    socket?.on("message:delete", (deletedMessagesIds: string[]) => {
      queryClient.setQueryData(
        ["messages", selectedChat?.id],
        (oldData: any) => {
          let newPages = [...oldData.pages];

          newPages = newPages.map((page) => ({
            ...page,
            messages: page.messages.filter((message: Message) => {
              return !deletedMessagesIds.includes(message._id.toString());
            }),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      console.log("deleted message", deletedMessagesIds);
      console.log(
        "messages",
        queryClient.getQueryData(["messages", selectedChat?.id])
      );
    });

    return () => {
      socket?.off("message:add");
      socket?.off("joined");
    };
  }, [isConnected]);
};

export default useChatSocket;
