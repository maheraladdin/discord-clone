"use client";

import axios from "axios";
import qs from "query-string";
import { useBoolean } from "usehooks-ts";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

export default function DeleteChannelModal() {
  const { isOpen, type, closeModal, data } = useModalStore();
  const router = useRouter();
  const isModalOpen = isOpen && type === ModalType.DELETE_CHANNEL;
  const { channel, server } = data;
  const { value, toggle } = useBoolean(false);

  const onConform = async () => {
    try {
      toggle();
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      closeModal();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      toggle();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Delete Channel
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want to delete{" "}
            <span className={"font-bold text-indigo-500"}>
              #{channel?.name}
            </span>
            ? channel will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"bg-gray-100 px-6 py-4"}>
          <div className="flex w-full items-center justify-between">
            <Button disabled={value} variant={"ghost"} onClick={closeModal}>
              Cancel
            </Button>
            <Button
              disabled={value}
              variant={"destructive"}
              onClick={onConform}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
