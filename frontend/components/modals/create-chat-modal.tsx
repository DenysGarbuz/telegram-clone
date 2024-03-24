"use client";

import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import FooterButton from "./common/footer-button";
import StaticModalWrapper from "./static-modal-wrapper";
import UnderlinedInput from "../underlined-input";
import PopoverWrapper from "../popover-wrapper";
import BodyArea from "./common/body-area";
import { MdCameraAlt } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { Avatar } from "@nextui-org/react";
import { ChatTypes } from "@/types";
import { useAppDispatch } from "@/hooks/store";
import { useDropzone } from "react-dropzone";
import useToken from "@/hooks/useToken";
import useModal from "@/hooks/useModal";

import { actions } from "@/store/state/stateSlice";
import axios from "@/utils/axios-config";
import PictureDropzone from "../picture-dropzone";

interface InitialValues {
  groupName: string;
}

const CreateChatModal = () => {
  const { onClose, isOpen, types } = useModal();
  const isModalOpen = isOpen && types.includes("createFolder");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const token = useToken();

  const handleClose = () => {
    onClose();
    setGroupName("");
    setCurrentIndex(0);
    setImage(null);
  };
  const handleNextModal = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };
  const handlePreviousModal = () => {
    setCurrentIndex((prevIndex) => (prevIndex !== 0 ? prevIndex - 1 : 0));
  };

  const handleCreate = async () => {
    const formData = new FormData();
    if (image) {
      formData.append("image", image, image.name);
    }
    formData.append("name", groupName);
    formData.append("type", ChatTypes.GROUP);

    const res = await axios.post("/api/chats", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(actions.chatsRefresh());
    handleClose();
    console.log("CREATE CHAT MODAL: result of creating", res);
  };

  return (
    <StaticModalWrapper
      isOpen={isModalOpen}
      onClose={onClose}
      animation="slide"
    >
      {currentIndex == 0 && (
        <InitialInterface
          image={image}
          setImage={setImage}
          onCancel={handleClose}
          onNext={handleNextModal}
          onChange={setGroupName}
          value={groupName}
        />
      )}
      {currentIndex == 1 && (
        <AddContactsModal
          onCancel={handlePreviousModal}
          onCreate={handleCreate}
        />
      )}
    </StaticModalWrapper>
  );
};

export default CreateChatModal;

interface InitialInterfaceProps {
  onCancel: () => void;
  onNext: () => void;
  value: string;
  onChange: (groupName: string) => void;
  image: string | null;
  setImage: (image: string) => void;
}

const InitialInterface = ({
  onCancel,
  onNext,
  value,
  onChange,
  image,
  setImage,
}: InitialInterfaceProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || "");
  };

  return (
    <div className="w-[400px] h-[170px] flex flex-col relative">
      <div className="w-full h-[80px]  ">
        <PopoverWrapper>
          <div className="absolute right-3 top-3 w-[50px] h-[50px] rounded-full   text-gray-400 text-semibold hover:text-gray-500 text-[20px] flex justify-center items-center  ">
            <HiDotsVertical />
          </div>
        </PopoverWrapper>
      </div>
      <div className="w-full flex h-full justify-center ">
        <div className="w-[230px]">
          <PictureDropzone
            image={image}
            setImage={(file) => setImage(URL.createObjectURL(file))}
          />
        </div>
        <div className="flex flex-col w-full justify-center pr-7">
          <UnderlinedInput
            autoFocus
            id="name"
            label="Group name"
            value={value}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      <div className="w-ful flex justify-end h-[110px] items-end">
        <FooterButton onClick={onCancel} name="Cansel" />
        <FooterButton onClick={onNext} name="Next" />
      </div>
    </div>
  );
};

const AddContactsModal = ({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: () => void;
}) => {
  const [selectedContacts, setSelectedContacts] = useState([]);

  return (
    <div className="w-[400px] h-full  flex flex-col">
      <div className="w-full min-h-[120px] bg-green-100">
        <h2>
          Add Members <span>{selectedContacts.length + 1}/20000</span>
        </h2>
        <div className="flex flex-wrap h-[70px] gap-2">
          {selectedContacts.map((contact) => (
            <div className=" overflow-hidden rounded-full  bg-gray-100 max-w-[100px] flex ">
              <div className="rounded-full bg-red-200 w-[30px] h-full"></div>
              {contact}
            </div>
          ))}

          <input
            className="w-[40px] flex-grow bg-transparent outline-none"
            type="text"
          />
        </div>
      </div>
      <div className="w-full flex h-full">
        <BodyArea className="h-[300px]">
          <div className="flex px-[20px] py-[10px] hover:bg-gray-100 items-center">
            <Avatar className="w-[45px] h-[45px] mr-[18px]" />
            <div className="flex flex-col">
              <h2 className="text-[14px] font-semibold text-black">
                Anastasia
              </h2>
              <p className="text-gray-400 text-sm font">last seen recently</p>
            </div>
          </div>
        </BodyArea>
      </div>
      <div className="w-ful flex justify-end h-[40px]">
        <FooterButton onClick={onCancel} name="Cansel" />
        <FooterButton onClick={onCreate} name="Next" />
      </div>
    </div>
  );
};
