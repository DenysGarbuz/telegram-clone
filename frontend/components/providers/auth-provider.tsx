"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useRefreshAuthorizationQuery } from "@/store/auth/apiSlice";
import LoadingSpinner from "../loading-spinner";
import { useAppDispatch } from "@/hooks/store";
import { actions } from "@/store/auth/authSlice";
import CurrentUserProvider from "@/components/providers/current-user-provider";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isLoading, isError, data } = useRefreshAuthorizationQuery(null, {
    pollingInterval: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(actions.setToken(data.accessToken));
    }
  }, [data]);

  useEffect(() => {
    if (router && isError) {
      router.push("/login");
    }
  }, [router, isError]);

  if (isLoading || (isError && !router)) {
    return <LoadingSpinner />;
  }

  return <CurrentUserProvider>{children}</CurrentUserProvider>;
};

export default AuthProvider;
