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
}: UnderlinedInputProps) => {
  return (
    <Input
      type={type}
      required
      id={id}
      value={value}
      onChange={onChange}
      errorMessage={errorMessage}
      onBlur={onBlur}
      label={label}
      variant="underlined"
      className={className}
      disableAnimation
      classNames={{
        inputWrapper: [" border-b-medium border-gray-800 "],
        
      }}
      
    />
  );
};

export default UnderlinedInput;
