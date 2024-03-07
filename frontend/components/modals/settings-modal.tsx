"use client";

import useModal from "@/hooks/useModal";
import DynamicModalWrapper, { DynamicModalBody } from "./modal-dynamic-wrapper";
import DynamicModalHeader from "./common/dynamic-modal-header";

const SettingsModal = () => {
  const { types, isOpen, onClose } = useModal();
  const isModalOpen = isOpen && types.includes("settings");

  return (
    <DynamicModalWrapper animation="slide" isOpen={isModalOpen} onClose={onClose}>
      <DynamicModalHeader onCloseClick={() => onClose()} name="Settings" />
      <DynamicModalBody>
        <div>settings</div>
      </DynamicModalBody>
    </DynamicModalWrapper>
  );
};

export default SettingsModal;
