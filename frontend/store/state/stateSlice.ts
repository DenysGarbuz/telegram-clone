import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedChat, Message, Chat } from "@/types";

interface State {
  chat: Chat | null;
  folderId: string | null;
  selectedChat: SelectedChat | null;
  menuOpen: boolean;
  chatsRefresh: boolean;
  selectedMessages: Message[];
  currentMessage: Message | null;
  chatMode: "selection" | "reply" | "edit" | "default";
  messageInProcess: Message | null;
}

const initialState: State = {
  chat: null,
  folderId: null,
  selectedChat: null,
  menuOpen: false,
  chatsRefresh: false,
  selectedMessages: [],
  currentMessage: null,
  chatMode: "default",
  messageInProcess: null,
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setChat(store, { payload }: PayloadAction<Chat | null>) {
      store.chat = payload;
    },
    setFolderId(store, { payload }) {
      store.folderId = payload;
    },
    setSelectedChat(store, { payload }: { payload: SelectedChat | null }) {
      if (payload?.id === store.selectedChat?.id) return;
      store.selectedChat = payload;
    },
    openMenu(store) {
      store.menuOpen = true;
    },
    closeMenu(store) {
      store.menuOpen = false;
    },
    chatsRefresh(store) {
      store.chatsRefresh = !store.chatsRefresh;
    },
    setCurrentMessage(store, { payload }: PayloadAction<Message | null>) {
      store.currentMessage = payload;
    },
    setSelectedMessages(store, { payload }: PayloadAction<Message[]>) {
      if (payload.length > 0 && store.chatMode !== "selection") {
        store.chatMode = "selection";
      } else if (payload.length === 0 && store.chatMode !== "default") {
        store.chatMode = "default";
      }
      store.selectedMessages = payload;
    },
    setChatMode(
      store,
      { payload }: PayloadAction<"reply" | "edit" | "default">
    ) {
      if (store.chatMode === "selection") {
        store.selectedMessages = [];
      }
      store.messageInProcess = store.currentMessage;
      store.chatMode = payload;
    },
    setMessageInProccess(store, { payload }: PayloadAction<Message | null>) {
      store.messageInProcess = payload;
    },
  },
});

export default stateSlice.reducer;
export const actions = stateSlice.actions;
