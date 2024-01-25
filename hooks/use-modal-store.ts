import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChannelType, Server } from "@prisma/client";

export enum ModalType {
  CREATE_SERVER,
  INVITE_PEOPLE,
  EDIT_SERVER,
  MANAGE_MEMBERS,
  CREATE_CHANNEL,
  LEAVE_SERVER,
  DELETE_SERVER,
}

type ModalData = {
  server?: Server;
  channelType?: ChannelType;
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  openModal: (
    type: ModalType,
    data?: ModalData,
    channelType?: ChannelType,
  ) => void;
  closeModal: () => void;
};

export const useModalStore = create(
  devtools<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    openModal: (type, data = {}) =>
      set({ isOpen: true, type, data }, false, "openModal"),
    closeModal: () => set({ isOpen: false }, false, "closeModal"),
  })),
);
