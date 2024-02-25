import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { ReactNode } from "react";

export default function PopoverWrapper({ children }: { children: ReactNode }) {
  return (
    <Popover  triggerScaleOnOpen={false} placement="right-start">
      <PopoverTrigger className="cursor-pointer ">{children}</PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2">
            <h3 className="text-small font-bold" {...titleProps}>
              Popover Content
            </h3>
            <div className="text-tiny">This is the popover content</div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
