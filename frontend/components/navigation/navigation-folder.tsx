"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { actions } from "@/store/state/stateSlice";

import { twMerge } from "tailwind-merge";

interface FolderProps {
  Icon?: React.ReactNode;
  name: string;

  folderId: string;
}

const Folder = ({ folderId, name, Icon }: FolderProps) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.state);

  const handleClick = () => {
    dispatch(actions.setFolderId(folderId));
  };

  return (
    <div
      onClick={handleClick}
      className={twMerge(
        "relative w-full h-[66px] flex-col  flex justify-center items-center cursor-pointer text-[12px] font-bold text-gray-400",
        state.folderId === folderId && "dark:bg-white/10 bg-light-400"
      )}
    >
      <div className="rounded-full absolute right-5 top-1 text-white bg-light-200 min-w-unit-5 text-center px-1">
        1
      </div>
      <div className="text-gray-400 text-[33px]">{Icon}</div>
      <div className="">{name}</div>
    </div>
  );
};

export default Folder;
