import { create } from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export enum ModalType {
  CREATE_SERVER,
  INVITE_PEOPLE,
  EDIT_SERVER,
  MANAGE_MEMBERS,
  CREATE_CHANNEL,
  LEAVE_SERVER,
  DELETE_SERVER,
  DELETE_CHANNEL,
  EDIT_CHANNEL,
  MESSAGE_FILE,
  DELETE_MESSAGE,
}

type ModalData = {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
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

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  openModal: (type, data = {}) => set({ isOpen: true, type, data }, false),
  closeModal: () => set({ isOpen: false }, false),
}));
