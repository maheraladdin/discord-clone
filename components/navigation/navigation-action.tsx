"use client";

import { Plus } from "lucide-react";

import ActionTooltip from "@/components/tooltips/action-tooltip";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

export default function NavigationAction() {
  const openModal = useModalStore((state) => state.openModal);
  return (
    <div>
      <ActionTooltip
        label={"Create a new Server"}
        side={"right"}
        align={"center"}
      >
        <button
          className={"group flex items-center"}
          onClick={() => openModal(ModalType.CREATE_SERVER)}
        >
          <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className={
                "text-emerald-500 transition-all group-hover:text-white"
              }
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
