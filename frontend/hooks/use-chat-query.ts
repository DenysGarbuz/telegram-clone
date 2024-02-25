import { useCallback } from "react";
import useToken from "./useToken";
import { Message, SelectedChat } from "@/types";
import qs from "query-string";
import axios from "@/utils/axios-config";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  selectedChat: SelectedChat;
}

export const useChatQuery = ({ selectedChat }: ChatQueryProps) => {
  const token = useToken();

  const fetchMessages = useCallback(
    async ({
      pageParam = 0,
    }): Promise<{
      messages: Message[];
      nextCursor: number;
    }> => {
      const url = qs.stringifyUrl({
        url: `/api/messages/${selectedChat.id}`,
        query: {
          cursor: pageParam,
        },
      });

      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      return res.data;
    },
    [selectedChat]
  );

  const { data, fetchNextPage, isFetching, isPending, hasNextPage } = useInfiniteQuery({
    queryKey: ["messages", selectedChat.id],
    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return { data, fetchNextPage, isFetching, isPending, hasNextPage };
};
