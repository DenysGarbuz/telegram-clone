import { cn } from "@nextui-org/react";

type Size = "sm" | "md";

interface ToggleProps {
  isChecked: boolean;
  onChange?: (isChecked: boolean) => void;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  size?: Size;
  styles?: {
    wrapper?: string;
    container?: string;
  };
  children?: React.ReactNode;
}

const Toggle = ({
  onChange,
  onIcon,
  offIcon,
  isChecked,
  size = "sm",
  styles,
  children,
}: ToggleProps) => {
  const handleClick = () => {
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <div
      className={cn("cursor-pointer ", styles?.wrapper || "w-min")}
      onClick={handleClick}
    >
      {children}
      <div
        className={cn("flex relative  items-center ", styles?.container, {
          "w-8 h-5": size === "sm",
        })}
      >
        <div
          className={cn("w-full rounded-full  bg-red-500", {
            "h-4": size === "sm",
            "bg-sky-500 border-sky-500": isChecked,
          })}
        ></div>
        <div
          className={cn(
            "flex justify-center items-center overflow-hidden absolute rounded-full bg-white border-2   transition-all",
            {
              "w-5 h-5": size === "sm",
              "translate-x-3 border-sky-500": isChecked,
              "border-red-500 ": !isChecked,
            }
          )}
        >
          {isChecked ? (
            <div className="text-sky-500">{onIcon}</div>
          ) : (
            <div className="text-red-500">{offIcon}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toggle;
