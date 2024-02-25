"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import ChatItem from "./chat-item";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "@/utils/axios-config";
import useToken from "@/hooks/useToken";
import { Chat } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import ChatInput from "./chat-input";
import ChatContextMenu from "./chat-context-menu";
import { actions } from "@/store/state/stateSlice";
import { SelectedChat } from "@/types";

const EDGE_WIDTH = 5;
const MIN_WIDTH = 285;
const MAX_WIDTH = 975;
const START_WIDTH = 300;

const ChatsSidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const width = useResizable(sidebarRef, START_WIDTH);
  const token = useToken();
  const { chatsRefresh } = useAppSelector((store) => store.state);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) {
        return;
      }
      try {
        setIsLoading(true);
        const { data: chats } = await axios.get("/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChats(chats);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [token, chatsRefresh]);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    chat: SelectedChat
  ) => {
    e.preventDefault();
    setShowContextMenu(true);
    setCursorPosition({ x: e.clientX, y: e.clientY });
    dispatch(actions.setSelectedChat(chat));
  };

  const handleChatClick = (chat: SelectedChat) => {
    dispatch(actions.setSelectedChat(chat));
  };

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.name.toLocaleLowerCase().startsWith(search.toLocaleLowerCase())
    );
  }, [chats, search]);

  return (
    <div
      style={{ width: `${width}px` }}
      ref={sidebarRef}
      className="h-full bg-white dark:bg-dark-100 border-r-1 dark:border-r-2 dark:border-dark-200 flex flex-col"
    >
      <ChatContextMenu
        cursorPosition={cursorPosition}
        isOpen={showContextMenu}
        onClose={() => setShowContextMenu(false)}
      />

      <ChatInput onChange={setSearch} value={search} />

      <div className="overflow-auto scrollbar-none  flex-1">
        {/* {isLoading && <p> loading</p>} */}
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat._id}
            onClick={() => handleChatClick({ id: chat._id, name: chat.name })}
            imageUrl={chat.imageUrl}
            onContextMenu={(e) =>
              handleContextMenu(e, { id: chat._id, name: chat.name })
            }
            name={chat.name}
            lastMessage={
              chat.messages.length > 0
                ? {
                    author: chat.messages[0].member.userId.email,
                    text: chat.messages[0].text,
                  }
                : { author: "Denis", text: "nonne" }
            }
            chatId={chat._id}
          />
        ))}
        {isLoading && "loading"}
      </div>
    </div>
  );
};

export default ChatsSidebar;

const useResizable = (ref: RefObject<HTMLDivElement>, startSize: number) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(startSize);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (ref.current && isResizing) {
        let width = e.clientX - ref.current?.getBoundingClientRect().left;

        if (width < MIN_WIDTH) {
          width = MIN_WIDTH;
        } else if (width > MAX_WIDTH) {
          width = MAX_WIDTH;
        }

        setWidth(width);
      }

      const isNearRightEdge =
        ref.current && e.offsetX + EDGE_WIDTH > ref.current.offsetWidth;

      if (isNearRightEdge) {
        ref.current.style.cursor = "ew-resize";
      } else if (ref.current) {
        ref.current.style.cursor = "default";
      }
    }

    function onMouseUp(e: MouseEvent) {
      setIsResizing(false);

      document.removeEventListener("mouseup", onMouseUp);
    }

    function onMouseDown(e: MouseEvent) {
      const isNearRightEdge =
        ref.current && e.offsetX + EDGE_WIDTH > ref.current.offsetWidth;
      if (isNearRightEdge) {
        setIsResizing(true);
        document.addEventListener("mouseup", onMouseUp);
      }
    }

    function handleSelectStart(e: Event) {
      e.preventDefault();
    }

    if (ref.current) {
      document.addEventListener("mousemove", onMouseMove);
      ref.current.addEventListener("mousedown", onMouseDown);
      ref.current.addEventListener("selectstart", handleSelectStart);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      ref.current?.removeEventListener("mousedown", onMouseDown);
      ref.current?.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isResizing]);

  return width;
};
