import { cookies } from "next/headers";

export function accessToken() {
  const accessToken = cookies().get("accessToken");
  return accessToken?.value || null;
}
