import { Chat, Message } from "@/types";
import { useAppDispatch, useAppSelector } from "./store";
import { actions } from "@/store/state/stateSlice";

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { currentMessage, selectedMessages, chatMode, messageInProcess, chat } =
    useAppSelector((store) => store.state);

  const setSelectedMessages = (messages: Message[]) => {
    dispatch(actions.setSelectedMessages(messages));
  };

  const setCurrentMessage = (message: Message | null) => {
    dispatch(actions.setCurrentMessage(message));
  };

  const setChatMode = (mode: "reply" | "edit" | "default") => {
    dispatch(actions.setChatMode(mode));
  };

  const setChat = (chat: Chat | null) => {
    dispatch(actions.setChat(chat));
  };

  const setMessageInProccess = (message: Message | null) => {
    dispatch(actions.setMessageInProccess(message));
  };

  return {
    chat,
    setChat,
    chatMode,
    setChatMode,
    currentMessage,
    messageInProcess,
    selectedMessages,
    setCurrentMessage,
    setSelectedMessages,
    setMessageInProccess,
  };
};
