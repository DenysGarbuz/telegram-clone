import { cn } from "@nextui-org/react";

const DynamicChatMenuButton = ({
  name,
  Icon,
  onClick,
  disabled
}: {
  name: string;
  Icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer hover:bg-gray-100 h-[40px] flex justify-left items-center text-gray-800",
      )}
    >
      <div className="w-[100px] flex justify-center items-center text-[20px]  ">{Icon || "icon"}</div>
      <p className="w-full text-[14px] font-medium">{name}</p>
    </div>
  );
};


export default DynamicChatMenuButton