import { useSocket } from "@/components/providers/socket-provider";
import { useChat } from "@/hooks/use-chat";
import { Message, Member, User } from "@/types";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export const extractNameOrEmail = (message: Message | null) => {
  if (!message) return null;
  const name = message.member?.userId.name;
  const email = message.member?.userId.email;

  return name || email || null;
};

export const sendMessage = async ({
  member,
  text,
  files,
  user,
  chatId,
  queryClient,
  chatMode,
  messageInProcess,
  socket
}: {
  member: Member;
  text: string;
  files: File[] | null;
  user: User;
  chatId: string;
  queryClient: QueryClient;
  socket: any;
  chatMode: string;
  messageInProcess: Message | null;
}) => {
  console.log("MEMBER inside CHATINPUT", member);


  if (text === "" && !files) return;
  let fileObjects = null;
  if (files) {
    fileObjects = await readFiles(files);
  }

  const fakeId = uuidv4();
  const fakeDate = new Date().toISOString();
  const optimisticMessage: Message = {
    _id: fakeId,
    member: {
      _id: member._id,
      userId: user,
      role: "none",
    },
    fileUrls: [],
    chatId: chatId,
    text,
    createdAt: fakeDate,
    updatedAt: fakeDate,
    loaded: false,
    messageReplyTo:
      chatMode === "reply" && messageInProcess ? messageInProcess : undefined,
  };

  queryClient.setQueryData(["messages", chatId], (oldData: any) => {
    const newPages = [...oldData.pages];
    newPages[0] = {
      ...newPages[0],
      messages: [optimisticMessage, ...newPages[0].messages],
    };

    return { ...oldData, pages: newPages };
  });

  // console.log(queryClient.getQueryData(["messages", chatId]));
  socket?.emit("message:add", {
    fakeId,
    text,
    chatId,
    memberId: member._id,
    files: fileObjects,
    messageReplyToId: chatMode === "reply" ? messageInProcess?._id : undefined,
  });
};

const readFiles = (files: File[]) => {
  const fileObjects = [];

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        let fileData = {
          buffer: event.target?.result,
          contentType: file.type,
          fileName: file.name,
        };

        resolve(fileData);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  for (const file of files) {
    fileObjects.push(readFile(file));
  }
  return Promise.all(fileObjects);
};
