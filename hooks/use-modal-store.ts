import { create } from "zustand";
import { Server } from "@prisma/client";

export enum ModalType {
  CREATE_SERVER,
  INVITE_PEOPLE,
  EDIT_SERVER,
}

type ModalData = {
  server?: Server;
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  openModal: (type, data = {}) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false }),
}));
