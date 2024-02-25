import useModal from "@/hooks/useModal";
import StaticModalWrapper from "./static-modal-wrapper";
import PictureDropzone from "../picture-dropzone";
import { Input } from "@nextui-org/react";
import UnderlinedInput from "../underlined-input";
import { useEffect, useState } from "react";
import { Chat, Member } from "@/types";
import MembersList from "./common/members-list";
import axiosConfig from "@/utils/axios-config";
import useToken from "@/hooks/useToken";
import { useAppSelector } from "@/hooks/store";
import Avatar from "../avatar";
import AdministratorsMenu from "./modal-menu/administrators-menu";
import StaticModalHeader from "./common/static-modal-header";
import { IoMdHeartEmpty } from "react-icons/io";
import { VscKey } from "react-icons/vsc";
import { RiLink } from "react-icons/ri";
import { RiShieldStarLine, RiGroupLine } from "react-icons/ri";
import { PiNotepad } from "react-icons/pi";

type Menu = "default" | "administrators";

const ManageChatModal = () => {
  const { isOpen, onClose, types } = useModal();
  const isModalOpen = isOpen && types.includes("manageChat");
  const [chat, setChat] = useState<Chat | null>(null);
  const { selectedChat, chatsRefresh } = useAppSelector((store) => store.state);
  const token = useToken();

  useEffect(() => {
    setChat(null);
    const fetchChat = async () => {
      try {
        const { data } = await axiosConfig.get(
          `/api/chats/${selectedChat?.id}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        setChat(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChat) {
      fetchChat();
    }
  }, [selectedChat, isModalOpen]);

  const [currentMenu, setCurrentMenu] = useState<Menu>("default");
  //   const { selectedChat } = useAppSelector((store) => store.state);
  //   const dispatch = useAppDispatch();
  //   const token = useToken();

  useEffect(() => {
    setCurrentMenu("default");
  }, [isModalOpen]);

  if (!chat) return null;

  return (
    <StaticModalWrapper animation="fade" onClose={onClose} isOpen={isModalOpen}>
      {currentMenu === "default" && (
        <ManageChatInitialMenu setCurrentMenu={setCurrentMenu} chat={chat} />
      )}
      {currentMenu === "administrators" && (
        <AdministratorsMenu
          onCloseClick={() => setCurrentMenu("default")}
          members={chat.members}
        />
      )}
    </StaticModalWrapper>
  );
};

export default ManageChatModal;

interface InitialMenuProps {
  setCurrentMenu: (menu: Menu) => void;
  chat: Chat;
}
const ManageChatInitialMenu = ({ setCurrentMenu, chat }: InitialMenuProps) => {
  const admins = chat.members.filter((member) => member.isAdmin);

  return (
    <>
      <StaticModalHeader name="Edit group" />
      <div className=" w-[400px] flex-grow flex flex-col text-gray-1000">
        <div className="flex flex-col ">
          <div className="flex  ">
            <div className="ml-5 mr-8">
              <PictureDropzone />
            </div>
            <div>
              <UnderlinedInput label="Channel name" />
            </div>
          </div>
          <div className="px-7 py-3">Description</div>
        </div>
        <div className="border-t-1 my-4" />
        <div className="flex flex-col">
          <MenuOption Icon={<IoMdHeartEmpty />}>Reactions</MenuOption>
          <MenuOption Icon={<VscKey />}>Premissions</MenuOption>
          <MenuOption Icon={<RiLink />}>Invite links</MenuOption>

          <MenuOption
            Icon={<RiShieldStarLine />}
            onClick={() => setCurrentMenu("administrators")}
          >
            <div className="flex justify-between">
              <p>Administrators</p>
              <span className="text-sky-600">{admins.length}</span>
            </div>
          </MenuOption>
          <MenuOption Icon={<RiGroupLine />}>Members</MenuOption>
          <MenuOption Icon={<PiNotepad />}>Recent Actions</MenuOption>
        </div>
      </div>
    </>
  );
};

interface MenuOption {
  Icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuOption = ({ Icon, children, onClick }: MenuOption) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-start items-center hover:bg-gray-100 h-[40px] cursor-pointer"
    >
      <div className="flex justify-center items-center ml-7  text-[22px] text-black/90">
        {Icon || "icon"}
      </div>
      <div className="w-full text-[14px] select-none font-normal px-5">
        {children}
      </div>
    </div>
  );
};
