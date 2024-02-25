import { SelectedChat } from "@/types";
import { Message } from "postcss";
import { useEffect, useState } from "react";

interface UseChatScrollProps {
  chatBottomRef: React.RefObject<HTMLDivElement>;
  chatBodyRef: React.RefObject<HTMLDivElement>;
  lastMessageOwner: boolean;
  count: number;
  loadMore: () => void;
  hasMoreMessages: boolean;
  isFetching: boolean;
}

export const useChatScroll = ({
  chatBodyRef,
  chatBottomRef,
  lastMessageOwner,
  count,
  hasMoreMessages,
  loadMore,
  isFetching,
}: UseChatScrollProps) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const chatDiv = chatBodyRef.current;

    const handleScroll = () => {
      const shouldLoadMore = chatDiv?.scrollTop === 0;
      if (shouldLoadMore && hasMoreMessages) {
        loadMore();
      }
    };

    chatDiv?.addEventListener("scroll", handleScroll);

    return () => {
      chatDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatBodyRef, loadMore, hasMoreMessages]);

  useEffect(() => {
    const bottomDiv = chatBottomRef.current;
    const chatDiv = chatBodyRef.current;

    const shouldScrollToBottom = () => {
      if (!initialized && bottomDiv) {
        setInitialized(true);
        console.log(true);
        return true;
      }

      if (!chatDiv) {
        return false;
      }

      if (lastMessageOwner) {
        return true;
      }

      const distanceToLastMessage =
        chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight;
      console.log(distanceToLastMessage);
      return distanceToLastMessage <= 300;
    };

    if (shouldScrollToBottom()) {
      setTimeout(() => {
        chatBottomRef?.current?.scrollIntoView({
          behavior: lastMessageOwner ? "instant" : "instant",
        });
      }, 0);
    }
  }, [chatBodyRef, chatBottomRef, count]);
};
