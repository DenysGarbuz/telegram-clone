import { cn } from "@nextui-org/react";
import { ChangeEvent } from "react";

interface ChatInputProps {
  onChange: (search: string) => void;
  value: string;
}

const ChatInput = ({ onChange, value }: ChatInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="h-[60px] flex justify-center items-center">
      <input
        onChange={handleChange}
        value={value}
        placeholder="  Search"
        style={{}}
        className={cn(
          " focus:bg-white text-sm font-lihgt transition-all duration-1000 ",
          "outline-none border-2 border-gray-100 rounded-full h-[38px] w-full mx-[15px] px-[10px] bg-gray-100",
          "caret-black"
        )}
        type="text"
      />
    </div>
  );
};

export default ChatInput;
