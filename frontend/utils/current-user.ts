import { accessToken } from "./access-token";
import type { User } from "@/types";

export async function currentUser(): Promise<User | null> {
  const token = accessToken();

  if (!token) {
    return null;
  }

  const res = await fetch(`http://localhost:3003/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
}
