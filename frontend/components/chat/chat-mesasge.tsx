import { Message } from "@/types";
import { extractNameOrEmail } from "@/utils/messages";
import { cn } from "@nextui-org/react";
import moment from "moment";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import ChatImages from "./chat-message-images";
import MessageImages from "./chat-message-images";
import MessgeFiles from "./chat-message-files";

interface BodyMessageProps {
  isOwner: boolean;
  prevMessage: Message | null;
  nextMessage: Message | null;
  message: Message;
  onContextMenu: (e: React.MouseEvent) => void;
  onClick: (() => void) | undefined;
  isSelected: boolean;
  fileUrls?: string[];
}

const BodyMessage = ({
  isOwner,
  message,
  prevMessage,
  nextMessage,
  onContextMenu,
  isSelected,
  onClick,
  fileUrls,
}: BodyMessageProps) => {
  const {
    createdAt,
    updatedAt,
    chatId,
    text,
    loaded,
    member,
    _id: messageId,
    messageReplyTo,
  } = message;
  const { imageUrl, email, name, _id: userId } = member.userId;

  const timestamp = moment(createdAt).format("hh:mm");
  const isPrevMessageFromSameUser =
    prevMessage && member._id === prevMessage?.member._id;
  const isNextMessageFromSameUser =
    nextMessage && member._id === nextMessage?.member._id;

  const isEdited = !moment(createdAt).isSame(moment(updatedAt));

  const imageRegex = /\.(png|jpe?g|gif|svg|webp)$/i;
  const isOnlyImages = !fileUrls?.some((url) => !imageRegex.test(url));
  const isOnlyFiles = !fileUrls?.some((url) => imageRegex.test(url));

  return (
    <div
      className={cn("w-full relative  flex  ", {
        // "justify-end": isOwner,
      })}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {!isPrevMessageFromSameUser && (
        <div
          className={cn(
            " left-[0.2rem]  absolute rounded-full flex justify-center items-center bg-white w-[40px] h-[40px] ml-4 mr-2",
            {
              "bottom-[2px]": isPrevMessageFromSameUser,
              "bottom-[10px]": !isPrevMessageFromSameUser,
            }
          )}
        >
          {imageUrl ? (
            <Image src={imageUrl} fill alt="member image" />
          ) : (
            <div className="capitalize">
              {name ? name.charAt(0) : email.charAt(0)}
            </div>
          )}
        </div>
      )}
      <div
        className={cn(
          " ml-[4.3rem] relative  overflow-hidden  rounded-tr-2xl rounded-br-2xl max-w-[550px]   text-[15px] ",
          "break-all inline-block shadow-sm",
          {
            "mb-[2px]": isPrevMessageFromSameUser,
            "mb-[10px]": !isPrevMessageFromSameUser,
            "rounded-tl-2xl": !isNextMessageFromSameUser,
            "rounded-bl-none ": !isPrevMessageFromSameUser,
            "rounded-tl-md": isNextMessageFromSameUser,
            "rounded-bl-md": isPrevMessageFromSameUser,
            "bg-[#effdde]": isOwner,
            "bg-white": !isOwner,
          }
        )}
      >
        {isSelected && (
          <div className="absolute top-0 left-0 w-full h-full bg-blue-400/30" />
        )}
        {messageReplyTo && (
          <div
            className={cn(
              "mb-1 cursor-pointer flex flex-col border-l-[2.2px] justify-center  pl-2",
              {
                "border-green-500 text-green-600": isOwner,
                "border-sky-500 text-sky-600": !isOwner,
              }
            )}
          >
            <p className=" text-[14px] font-medium">
              {extractNameOrEmail(messageReplyTo)}
            </p>
            <p className="text-[14px] text-black">{messageReplyTo?.text}</p>
          </div>
        )}
        {fileUrls && isOnlyImages && <MessageImages images={fileUrls} />}
        {fileUrls && isOnlyFiles && <MessgeFiles files={fileUrls} />}
        <div className="mx-3 py-[6px]">
          <span className="">{text}</span>

          <div
            className={cn("pl-[10px] float-right pt-[6px] flex  ", {
              "text-green-600/80": isOwner,
              "text-gray-400": !isOwner,
            })}
          >
            {isEdited && (
              <p className="  text-[14px] text-right  font-normal">edited</p>
            )}
            <p className=" ml-1 text-[14px]  text-right  font-normal">
              {timestamp}
            </p>
            {isOwner && (
              <div className="text-[13px] ml-2 font-bold flex justify-end items-center">
                {loaded !== false ? <FaCheck /> : <LuClock3 />}
              </div>
            )}
            <div className="clear-both" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMessage;
