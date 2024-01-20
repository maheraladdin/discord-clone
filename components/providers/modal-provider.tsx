"use client";

import { useIsClient } from "usehooks-ts";

import { CreateServerModal } from "@/components/modals/create-server-modal";

export const ModalProvider = () => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return (
    <>
      <CreateServerModal />
    </>
  );
};
