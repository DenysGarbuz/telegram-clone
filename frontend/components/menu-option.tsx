import { cn } from "@nextui-org/react";

interface MenuOptionProps {
  name: string;
  Icon?: React.ReactNode;
  onClick?: () => void;
  classNames?: string;
}

const MenuOption = ({
  Icon,
  name,
  onClick,
  classNames = "",
}: MenuOptionProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer hover:bg-gray-100 h-[40px] flex justify-left items-center text-gray-800",
        classNames
      )}
    >
      <div className="w-[25%] flex justify-center text-[20px]  ">{Icon}</div>
      <p className="w-[75%] text-[14px] font-normal">
        {name}
      </p>
    </div>
  );
};


export default MenuOption