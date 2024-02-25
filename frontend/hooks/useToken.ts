import { useAppSelector } from "./store";

export default function useToken() {
  const { token } = useAppSelector((store) => store.auth);
  return token;
}
