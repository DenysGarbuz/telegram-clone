import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        "slide-from-right": "slideFromRight 0.2s ease-in-out",
      },
      keyframes: {
        slideFromRight: {
          "0%": {
            transform: "translateX(200px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dark: {
          100: "#19212A",
          200: "#0E1621",
          300: "#5E87BC",
        },
        light: {
          100: "white",
          200: "#419FD9",
          300: "#293A4C",
          400: "#19212A",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    nextui({
      themes: {
        light: {
          colors: {
            default: "#419FD9",
          },
        },
        dark: {
          colors: {
            default: "#2F70A5",
          },
        },
      },
    }),
  ],
};
export default config;
