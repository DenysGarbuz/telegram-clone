"use client"
import useToken from "@/hooks/useToken";
import { useEffect } from "react";
import { actions } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/hooks/store";

function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const token = useToken();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      dispatch(actions.setIsError(false));
      dispatch(actions.setIsLoading(true));
      try {
        if (!token) {
          return;
        }

        const res = await fetch(`http://localhost:3003/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const userData = await res.json();

        dispatch(actions.setUser(userData));
      } catch (error) {
        dispatch(actions.setIsError(true));
      } finally {
        dispatch(actions.setIsLoading(false));
      }
    };

    fetchCurrentUser();
  }, [token]);

  return <>{children}</>;
}

export default CurrentUserProvider;
