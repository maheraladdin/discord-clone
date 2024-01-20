import { create } from "zustand";

export enum ModalType {
  CREATE_SERVER,
}

type ModalStore = {
  type: ModalType | null;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  openModal: (type) => set({ isOpen: true, type }),
  closeModal: () => set({ isOpen: false }),
}));
