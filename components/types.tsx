import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ActionTooltip from "./tooltips/action-tooltip";

export enum SearchTypes {
  CHANNEL,
  MEMBER,
}

export const iconMap = {
  [ChannelType.TEXT]: <Hash className={"mr-2 h-4 w-4"} />,
  [ChannelType.AUDIO]: <Mic className={"mr-2 h-4 w-4"} />,
  [ChannelType.VIDEO]: <Video className={"mr-2 h-4 w-4"} />,
};

export const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ActionTooltip label={"Moderator"} side={"right"} align={"end"}>
      <ShieldCheck className={"mr-2 h-4 w-4 text-indigo-500"} />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip label={"Admin"} side={"right"} align={"end"}>
      <ShieldAlert className={"mr-2 h-4 w-4 text-rose-500"} />
    </ActionTooltip>
  ),
};
