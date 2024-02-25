import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModalType } from "@/types";



interface State {
  openModals: {type: ModalType, data?: any}[];
  isOpen: boolean;
}

const initialState: State = {
  openModals: [],
  isOpen: false,
};

const modalSlice = createSlice({
  initialState,
  name: "modal",
  reducers: {
    onOpen: (store, { payload }: PayloadAction<{type: ModalType, data?: {} }>) => {
      if (store.openModals.some(modal => modal.type === payload.type)) return;
      store.openModals = [...store.openModals, payload];
      store.isOpen = true;
    },
    onClose: (store) => {
      if (store.openModals.length > 1) {
        store.openModals = store.openModals.slice(0, -1);
      } else {
        store.openModals = [];
      }
    },
    // onOpenDynamic: (store, { payload }: PayloadAction<DynamicModalType>) => {
    //   store.isOpen = true;
    //   store.dynamicType = payload;
    // },
    // onOpenStatic: (store, { payload }: PayloadAction<StaticModalType>) => {
    //   store.isOpen = true;
    //   store.staticType = payload;
    // },
    // onCloseDynamic: (store) => {
    //   store.dynamicType = null;
    // },
    // onCloseStatic: (store) => {
    //   store.staticType = null;
    // },
    // onClose: (store) => {
    //   store.isOpen = false;
    //   store.dynamicType = null;
    //   store.staticType = null;
    // }
  },
});

export default modalSlice.reducer;
export const actions = modalSlice.actions;
