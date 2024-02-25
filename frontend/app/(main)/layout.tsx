import ChatsSidebar from "@/components/chats-panel/chats-sidebar";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import AuthProvider from "@/components/providers/auth-provider";
import ModalProvider from "@/components/providers/modal-provider";
import SocketProvider from "@/components/providers/socket-provider";
import { Metadata } from "next";
import { TanstakQueryProvider } from "@/components/providers/tanstak-query-provider";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <TanstakQueryProvider>
          <SocketProvider>
            <ModalProvider />
            <div className="h-full w-full flex">
              <div className=" h-full w-[80px] ">
                <NavigationSidebar />
              </div>
              <div className="hidden md:flex h-full ">
                <ChatsSidebar />
              </div>
              <main className="h-full flex-1">{children}</main>
            </div>
          </SocketProvider>
        </TanstakQueryProvider>
      </AuthProvider>
    </>
  );
}
