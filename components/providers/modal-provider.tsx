"use client";

import { useIsClient } from "usehooks-ts";

import {
  CreateServerModal,
  InvitePeopleModal,
  EditServerModal,
  ManageMembersModal,
  CreateChannelModal,
  LeaveServerModal,
  DeleteServerModal,
  DeleteChannelModal,
  EditChannelModal,
  MessageFileModal,
  DeleteMessageModal,
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
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;
