"use client";

import useModal from "@/hooks/useModal";
import StaticModalWrapper from "./static-modal-wrapper";
import StaticModalHeader from "./common/static-modal-header";
import FooterButton from "./common/footer-button";
import UnderlinedInput from "../underlined-input";
import MessageImages from "../chat/chat-message-images";
import Image from "next/image";
import MessgeFiles from "../chat/chat-message-files";

const SendFileModal = ({
  files,
  onSendClick,
  onClose,
}: {
  files: File[] | null;
  onSendClick: () => void;
  onClose: () => void;
}) => {
  const { isOpen, types, onClose: onModalClose } = useModal();
  const isModalOpen = isOpen && types.includes("sendImage");

  const handleClose = () => {
    onClose();
    onModalClose();
  };

  return (
    <StaticModalWrapper animation="fade" isOpen={isModalOpen} onClose={handleClose}>
      <div className="w-[400px] flex-flex-col">
        <StaticModalHeader name="Send Image" />
        <div className="px-7">
          {files?.map((file) => {
            const objfile = URL.createObjectURL(file);
            if (file.type.includes("image")) {
              return <MessageImages images={[objfile]} />;
            } else {
              return <MessgeFiles files={[objfile]} />;
            }
          })}
          <div>
            <UnderlinedInput label="Caption" />
          </div>
        </div>
        <div className="flex justify-between px-3">
          <FooterButton name="Add" />
          <div>
            <FooterButton onClick={handleClose} name="Cancel" />
            <FooterButton onClick={onSendClick} name="Send" />
          </div>
        </div>
      </div>
    </StaticModalWrapper>
  );
};

export default SendFileModal;
