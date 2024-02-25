import { Message, Member, User } from "@/types";

export const extractNameOrEmail = (message: Message | null) => {
  if (!message) return null;
  const name = message.member?.userId.name;
  const email = message.member?.userId.email;

  return name || email || null;
};
