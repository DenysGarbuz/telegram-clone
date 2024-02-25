import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider";
import StoreProvider from "@/components/providers/store-provider";

import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { twMerge } from "tailwind-merge";


const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Telegram",
  description: "Telegram",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <body className={twMerge("h-full w-full overflow-hidden", openSans.className)}>
        <StoreProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
