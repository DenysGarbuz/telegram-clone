"use client";

import { Switch, cn } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { RiGroupLine } from "react-icons/ri";
import { PiMoon } from "react-icons/pi";



const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isSelected = theme === "dark";

  return (
    
      <Switch
       
        size="sm"
        isSelected={isSelected}
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
        classNames={{
          base: cn(
            "flex max-w-full w-full justify-between flex-row-reverse px-5 py-3 dark:hover:bg-white/5 hover:bg-gray-100"
          ),
          wrapper: cn(
            "p-0 h-4 w-9 overflow-visible ",

            //light
            "bg-gray-400",
            //dark
            "group-data-[selected]:bg-dark-300"
          ),
          thumb: cn(
            "w-5 h-5 border-2 shadow-lg",

            //light
            "bg-light-100",
            "border-gray-400",
            //dark
            "group-data-[selected]:bg-dark-100",
            "group-data-[selected]:border-dark-300"
          ),
        }}
      >
          <div className="flex ">
            <div className=" text-xl mr-3 text-black dark:text-white">
              <PiMoon />
            </div>
            <p>Night Mode</p>
          </div>
      </Switch>


   
  );
};

export default ThemeSwitcher;
