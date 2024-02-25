"use client";
import type { User } from "@/types";
import {  useAppSelector } from "./store";


interface UseCurrentUser {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  token: string | null;
}

export function useCurrentUser(): UseCurrentUser {
  const { user, isError, isLoading, token } = useAppSelector(
    (store) => store.auth
  );
  return { user, isError, isLoading, token };
}

