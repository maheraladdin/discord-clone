"use client";

import { useIsClient } from "usehooks-ts";

import {
  CreateServerModal,
  InvitePeopleModal,
  EditServerModal,
} from "@/components/modals";

const ModalProvider = () => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
      <EditServerModal />
    </>
  );
};

export default ModalProvider;
