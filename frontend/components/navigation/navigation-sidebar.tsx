import { PiChatsCircleThin } from "react-icons/pi";
import Folder from "./navigation-folder";
import Menu from "./navigation-menu";
import MenuButton from "./navigation-menu-button";
import axios from "@/utils/axios-config";
import { useEffect } from "react";
import { cookies } from "next/headers";
import { accessToken } from "@/utils/access-token";

const NavigationSidebar = async () => {
  return (
    <div className="flex-col w-full h-full dark:bg-dark-200 bg-light-300 ">
      <MenuButton />

      <Menu />
      <div className="w-full overflow-y-scroll scrollbar-hide">
        <Folder
          name="All chats"
          folderId="AllChats"
          Icon={<PiChatsCircleThin />}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
