import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { actions as authActions } from "@/store/auth/authSlice";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { User } from "@/types";

function makeStore(initialUser: User | null = null) {
  const store = configureStore({
    reducer: { auth: authReducer },
  });
  if (initialUser) {
    store.dispatch(authActions.setUser(initialUser));
  }
  return store;
}

describe("useCurrentUser", () => {
  it("returns null user by default", () => {
    const store = makeStore();
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("returns the user once set in store", () => {
    const alice: User = {
      _id: "abc",
      name: "Alice",
      email: "alice@example.com",
      imageUrl: null,
    };
    const store = makeStore(alice);
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.user).toEqual(alice);
  });
});
