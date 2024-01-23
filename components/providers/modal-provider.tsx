"use client";

import { useIsClient } from "usehooks-ts";

import {
  CreateServerModal,
  InvitePeopleModal,
  EditServerModal,
  ManageMembersModal,
  CreateChannelModal,
} from "@/components/modals";

const ModalProvider = () => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
    </>
  );
};

export default ModalProvider;