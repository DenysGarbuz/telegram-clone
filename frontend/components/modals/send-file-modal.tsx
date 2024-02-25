"use client";

import useModal from "@/hooks/useModal";
import StaticModalWrapper from "./static-modal-wrapper";
import StaticModalHeader from "./common/static-modal-header";

const SendFileModal = ({ file }: { file: File }) => {
  const { isOpen, types, onClose } = useModal();
  const isModalOpen = isOpen && types.includes("sendImage");

  return (
    <StaticModalWrapper animation="fade" isOpen={isModalOpen} onClose={onClose}>
      <div className="w-[400px] flex-flex-col">
        <StaticModalHeader name="Send Image" />
        <div className="flex px-7">
          <div className="bg-black w-full h-[400px] text-white">
            {file && file.type}
          </div>
        </div>
      </div>
    </StaticModalWrapper>
  );
};

export default SendFileModal;
