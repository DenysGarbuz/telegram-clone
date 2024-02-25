"use client";
import useModal from "@/hooks/useModal";
import StaticModalWrapper from "./static-modal-wrapper";
import FooterButton from "./common/footer-button";
import { Checkbox } from "@nextui-org/react";
import axios from "@/utils/axios-config";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { actions } from "@/store/state/stateSlice";
import { headers } from "next/headers";
import useToken from "@/hooks/useToken";

const LeaveChatModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type == "leaveChat";
  const { selectedChat } = useAppSelector((store) => store.state);
  const dispatch = useAppDispatch();
  const token = useToken();

  const handleGroupDelete = async () => {
    try {
      await axios.post(
        `/api/chats/leave/${selectedChat?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(actions.chatsRefresh());
      dispatch(actions.setSelectedChat(null));
      onClose();
    }
  };

  return (
    <StaticModalWrapper animation="fade" onClose={onClose} isOpen={isModalOpen}>
      <div className="h-[190px] w-[340px] flex-grow flex flex-col text-gray-1000">
        <div className="h-full w-full pt-[45px] pl-[25px] pr-[50px] row">
          <p>Are you sure you want to leave this group?</p>
          <div className="mt-[20px]">
            <Checkbox radius="sm" disableAnimation>
              Delete for everyone
            </Checkbox>
          </div>
        </div>
        <div className="h-[50px] w-full flex justify-end">
          <FooterButton onClick={onClose} name="Cancel" />
          <FooterButton
            onClick={handleGroupDelete}
            className="text-red-500 hover:bg-red-100"
            name="Leave"
          />
        </div>
      </div>
    </StaticModalWrapper>
  );
};

export default LeaveChatModal;
