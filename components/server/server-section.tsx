"use client";

import { Plus, Settings } from "lucide-react";
import { ChannelType, MemberRole } from "@prisma/client";

import { ActionTooltip } from "@/components/tooltips";
import { ServerWithMembersAndProfiles } from "@/types";
import { ServerSideBarTypes } from "@/components/types";
import { ModalType, useModal } from "@/hooks/use-modal";

type ServerSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: ServerSideBarTypes;
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
};

export default function serverSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  // eslint-disable-next-line
  const openModal = useModal((state) => state.openModal);

  return (
    <div className={"flex items-center justify-between py-2"}>
      <p
        className={
          "text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400"
        }
      >
        {label}
      </p>
      {role !== MemberRole.GUEST &&
        sectionType === ServerSideBarTypes.CHANNEL && (
          <ActionTooltip
            label={`Create ${label.slice(0, label.length - 1)}`}
            side={"top"}
          >
            <button
              className={
                "text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              }
              onClick={() =>
                openModal(ModalType.CREATE_CHANNEL, { channelType })
              }
            >
              <Plus className={"h-4 w-4"} />
            </button>
          </ActionTooltip>
        )}
      {role === MemberRole.ADMIN &&
        sectionType === ServerSideBarTypes.MEMBER && (
          <ActionTooltip label={`Member Settings`} side={"top"}>
            <button
              className={
                "text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              }
              onClick={() => openModal(ModalType.MANAGE_MEMBERS, { server })}
            >
              <Settings className={"h-4 w-4"} />
            </button>
          </ActionTooltip>
        )}
    </div>
  );
}
