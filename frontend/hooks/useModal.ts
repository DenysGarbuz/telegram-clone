import { actions } from "../store/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "./store";
import { ModalType } from "@/types";

const useModal = () => {
  const dispatch = useAppDispatch();
  const { openModals, isOpen } = useAppSelector((store) => store.modal);

  const onOpen = (type: ModalType, data?: any) => {
    dispatch(actions.onOpen({ type, data }));
  };

  const onClose = () => {
    dispatch(actions.onClose());
  };

  const types = openModals.map((modal) => modal.type);

  return {
    types,
    openModals,
    isOpen,
    onOpen,
    onClose,
  };
};

export default useModal;
