export type User = {
  _id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
};

export type Message = {
  member: Member | string;
  text: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  chatId: string;
  loaded?: boolean;
  messageReplyTo?: Message;
};

export type Member = {
  _id: string;
  isAdmin: boolean;
  userId: User | string;
  chatId: string;
  rights: {
    canAddMembers: boolean;
    canDeleteMessages: boolean;
    canBanUsers: boolean;
    canPinMessages: boolean;
    canAddNewAdmins: boolean;
  };
};

export type Chat = {
  name: string;
  _id: string;
  imageUrl: string;
  members: Member[];
  type: ChatType;
  messages: Message[];
};

export type SelectedChat = { id: string; name: string };

export const ChatTypes = {
  CHANNEL: "CHANNEL",
  GROUP: "GROUP",
};

export type ChatType = keyof typeof ChatTypes;

export type ModalType =
  | "createFolder"
  | "deleteGroup"
  | "leaveChat"
  | "chatMenu"
  | "manageChat"
  | "deleteMessage"
  | "sendImage"
