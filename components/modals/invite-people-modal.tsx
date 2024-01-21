"use client";

import { Check, Copy, RefreshCw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

import { ModalType, useModalStore } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useBoolean, useCopyToClipboard } from "usehooks-ts";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function InvitePeopleModal() {
  const { isOpen, type, closeModal, data, openModal } = useModalStore();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === ModalType.INVITE_PEOPLE;
  const { server } = data;

  const [_, copy] = useCopyToClipboard();
  const { value: copyLoading, toggle: toggleCopyLoading } = useBoolean(false);
  const { value: generateLoading, toggle: toggleGenerateLoading } =
    useBoolean(false);

  const inviteLink = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = async () => {
    toggleCopyLoading();
    await copy(inviteLink);
    setTimeout(() => {
      toggleCopyLoading();
    }, 1000);
  };

  const onGenerate = async () => {
    try {
      toggleGenerateLoading();
      const res = await axios.patch(
        `/api/servers/${server?.id}/generate-new-invite-code`,
      );
      openModal(ModalType.INVITE_PEOPLE, { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      toggleGenerateLoading();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className={"overflow-hidden bg-white p-0 text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Invite People
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className={
              "text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
            }
          >
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              className={
                "cursor-copy border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-copy"
              }
              onClick={onCopy}
              value={inviteLink}
              contentEditable={false}
              disabled={copyLoading || generateLoading}
            />
            <Button
              disabled={copyLoading || generateLoading}
              onClick={onCopy}
              variant={"primary"}
              size={"icon"}
            >
              {copyLoading ? (
                <Check className={"h-4 w-4"} />
              ) : (
                <Copy className={"h-4 w-4"} />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className={"mt-4 text-xs text-zinc-500"}
            disabled={generateLoading}
            onClick={onGenerate}
          >
            Generate a new link
            <RefreshCw
              className={cn("ml-2 h-4 w-4", generateLoading && "animate-spin")}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
