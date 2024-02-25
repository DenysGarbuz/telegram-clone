"use client"
import { useAppDispatch } from "@/hooks/store";
import { IoMenuOutline } from "react-icons/io5";
import { actions } from "@/store/state/stateSlice";

const MenuButton = () => {
  const dispatch = useAppDispatch()

  return (
    <button onClick={() => dispatch(actions.openMenu())} className="h-[60px]  w-full text-gray-400 flex justify-center items-center  text-[28px] ">
      <IoMenuOutline />
    </button>
  );
};

export default MenuButton;
