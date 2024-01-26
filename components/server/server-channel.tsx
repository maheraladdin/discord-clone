"use client";
import { Edit, Lock, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Channel, Server, MemberRole } from "@prisma/client";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/tooltips";
import { iconMapLucidIcons } from "@/components/types";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

export default function ServerChannel({
  channel,
  server,
  role,
}: ServerChannelProps) {
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();
  const params = useParams();

  const handleClick = () => {
    router.push(`/server/${server.id}/channel/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    openModal(action, { channel, server });
  };

  const Icon = iconMapLucidIcons[channel.type];
  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition-all hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon
        className={"h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400"}
      />
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition-all group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          channel.id === params.channelId &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <ActionTooltip label={"Edit Channel"}>
            <Edit
              onClick={(e) => onAction(e, ModalType.EDIT_CHANNEL)}
              className={
                "hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
              }
            />
          </ActionTooltip>
          <ActionTooltip label={"Delete Channel"}>
            <Trash
              onClick={(e) => onAction(e, ModalType.DELETE_CHANNEL)}
              className={
                "hidden h-4 w-4 text-rose-500 transition hover:text-rose-600 group-hover:block dark:text-rose-400 dark:hover:text-rose-300"
              }
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <div className={"ml-auto"}>
          <ActionTooltip label={"Locked"}>
            <Lock
              className={"h-4 w-4 text-zinc-500 transition dark:text-zinc-400"}
            />
          </ActionTooltip>
        </div>
      )}
    </button>
  );
}
