import { cn } from "@nextui-org/react";

const Delimiter = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-gray-200/60 border-t-2 border-b-1 border-gray-300/30 text-gray-500/80  font-normal text-[14px] min-h-3 w-full px-5  mention_gradient ",
        className
      )}
    >
      {text && <p className="pt-2 pb-4">{text}</p>}
    </div>
  );
};

export default Delimiter;
