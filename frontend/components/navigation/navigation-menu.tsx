"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { Avatar } from "@nextui-org/react";
import { RiGroupLine } from "react-icons/ri";
import { actions } from "@/store/state/stateSlice";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";
import ThemeSwitcher from "../theme-switcher";
import useModal from "@/hooks/useModal";
import { TbGenderDemigirl } from "react-icons/tb";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { ModalType } from "@/types";
import Link from "next/link";

const Menu = () => {
  const { menuOpen } = useAppSelector((store) => store.state);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  function handleClickOutside(e: MouseEvent) {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      dispatch(actions.closeMenu());
    }
  }

  return (
    <>
      <motion.div
        ref={ref}
        className={twMerge(
          "absolute left-0 top-0 h-full w-[300px] dark:bg-dark-100 flex flex-col bg-white z-50 transition duration-[0.15]",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex-1">
          <div className=" p-5 flex flex-col h-[148px] border-b-1 dark:border-gray-900 border-gray-200 mb-2">
            <div className="w-full ">
              <Avatar
                className="w-14 h-14 text-2xl text-white"
                src={""}
                name={
                  (user?.name && user?.name.charAt(0).toUpperCase()) ||
                  (user?.email && user?.email.charAt(0).toUpperCase())
                }
              />
            </div>
            <p className="pt-4 text-sm font-bold">
              {user?.name || user?.email}
            </p>
          </div>

          {/* settings */}
          <div className="flex flex-col justify-start ">
            <MenuItem
              Icon={<RiGroupLine />}
              name="New Gruop"
              type="createFolder"
            />
            <MenuItem
              Icon={<TbGenderDemigirl />}
              name="New Channel"
              type="createFolder"
            />
            <MenuItem
              Icon={<RiGroupLine />}
              name="Contacts"
              type="createFolder"
            />
            <MenuItem
              Icon={<RiGroupLine />}
              name="Calls"
              type="createFolder"
            />
            <MenuItem
              Icon={<RiGroupLine />}
              name="Saved Messages"
              type="createFolder"
            />
            <MenuItem
              Icon={<RiGroupLine />}
              name="Settings"
              type="settings"
            />

            <ThemeSwitcher />
          </div>
        </div>
        <div className="h-[50px] group-[gg] pl-[20px] flex gap-3 items-center text-blue-500">
          <Link
            className="flex  items-center underline"
            href="https://www.linkedin.com/in/garbuz-denys/"
          >
            <p>Denys Garbuz</p>
            <div className="text-20[px] ml-2">
              <FaLinkedin />
            </div>
          </Link>
          <p
            onClick={() => alert("Dont do that -_- ")}
            className="text-gray-300 hover:group-[gg]:bg-black text-[12px] cursor-pointer"
          >
            X
          </p>
        </div>
      </motion.div>
    </>
  );
};

interface MenuItemProps {
  Icon: React.ReactNode;
  name: string;
  type: ModalType;
}

const MenuItem = ({ Icon, name, type }: MenuItemProps) => {
  const dispatch = useAppDispatch();
  const { onOpen } = useModal();

  const handleClick = () => {
    onOpen(type);
    dispatch(actions.closeMenu());
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex px-5 py-3 dark:hover:bg-white/5 hover:bg-gray-100"
    >
      <div className="text-xl mr-3 text-black dark:text-white">{Icon}</div>
      <div className="font-medium text-sm">{name}</div>
    </div>
  );
};

export default Menu;
