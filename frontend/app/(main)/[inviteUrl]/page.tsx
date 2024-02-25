"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useAppDispatch } from "@/hooks/store";
import useToken from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { actions } from "@/store/state/stateSlice";
import axios from "@/utils/axios-config";

export default function InviteUrl({
  params,
}: {
  params: { inviteUrl: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const token = useToken();
  const dispatch = useAppDispatch();

  useEffect(() => {
    //setIsLoading(true);
    const fetchChat = async () => {
      try {
        // if (!params.inviteUrl.startsWith("%2B")) {
        //   throw new Error("Wront invite format");
        // }

        const { data: chat } = await axios.get(
          `/api/chats/url/${params.inviteUrl}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(actions.setSelectedChat({ id: chat._id, name: chat.name }));
      } catch (error) {
        console.log(error);
        

      } finally {
        router.push("/");
        //setIsLoading(false);
      }
    };
    fetchChat();
  }, [token]);

  return <LoadingSpinner />;
}
