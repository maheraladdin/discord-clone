"use client";

import axios from "axios";
import qs from "query-string";
import { useBoolean } from "usehooks-ts";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ModalType, useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";

export default function DeleteMessageModal() {
  const { isOpen, type, closeModal, data } = useModal();
  const isModalOpen = isOpen && type === ModalType.DELETE_MESSAGE;
  const { apiUrl, query } = data;
  const { value, toggle } = useBoolean(false);

  const onConform = async () => {
    try {
      toggle();
      const url = qs.stringifyUrl({
        url: apiUrl as string,
        query,
      });
      await axios.delete(url);
      closeModal();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Are you sure you want to delete this message? message will be
            permanently deleted
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
