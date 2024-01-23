"use client";

import axios from "axios";
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

export default function LeaveServerModal() {
  const { isOpen, type, closeModal, data } = useModalStore();
  const router = useRouter();
  const isModalOpen = isOpen && type === ModalType.LEAVE_SERVER;
  const { server } = data;
  const { value, toggle } = useBoolean(false);

  const onConform = async () => {
    try {
      toggle();
      await axios.patch(`/api/servers/${server?.id}/leave-server`);
      closeModal();
      router.refresh();
      router.push("/");
      window.location.reload();
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
            Leave Server
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want to leave{" "}
            <span className={"font-bold text-indigo-500"}>{server?.name}</span>?
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
