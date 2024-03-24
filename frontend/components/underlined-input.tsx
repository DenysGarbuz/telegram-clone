import { Input } from "@nextui-org/react";
import { ChangeEvent } from "react";

interface UnderlinedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
  onBlur?: (e: ChangeEvent) => void;
  errorMessage?: string | undefined | false;
  className?: string;
  type?: "password";
  autoFocus?: boolean
}

const UnderlinedInput = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
  type,
  className,
  autoFocus = false
}: UnderlinedInputProps) => {
  return (
    <div className={"py-3 " + className}>
      <div className="relative w-full h-[40px] ">
        <input
          autoFocus={autoFocus}
          id={id}
          onBlur={onBlur}
          onChange={onChange}
          required
          className="w-full  border-b-1 outline-none h-full peer"
          type={type}
          value={value}
        />
        <div className="absolute w-full  bottom-0  border-b-2 border-light-200 scale-0 peer-focus:scale-100 transition-all duration-500"></div>
        <label className="pointer-events-none transition-all absolute left-1 bottom-3  peer-valid:scale-90 peer-valid:-translate-y-6 peer-valid:-translate-x-1 peer-focus:text-light-200 peer-focus:scale-90 peer-focus:-translate-y-6 peer-focus:-translate-x-1 text-gray-400 font-medium text-[15px]">
          {label}
        </label>
        {errorMessage && (
          <p className="mt-1 text-[13px] text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UnderlinedInput;
