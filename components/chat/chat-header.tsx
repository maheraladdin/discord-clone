import { z } from "zod";
import { ChannelType } from "@prisma/client";

import MemberAvatar from "@/components/member-avater";
import { MobileToggle } from "@/components/mobile-toggle";
import { SocketIndicator } from "@/components/socket-indicator";
import { iconMapLucidIcons, ServerSideBarTypes } from "@/components/types";

type ChannelIdPageProps = {
  serverId: string;
  name: string;
  type: ChannelType | ServerSideBarTypes.MEMBER;
  imgUrl?: string;
};

const ChannelTypeSchema = z.nativeEnum(ChannelType);

export default function ChatHeader({
  serverId,
  name,
  type,
  imgUrl,
}: ChannelIdPageProps) {
  const isChannelType = ChannelTypeSchema.safeParse(type);
  let Icon = null;

  if (isChannelType.success) Icon = iconMapLucidIcons[type as ChannelType];

  return (
    <div
      className={
        "text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800"
      }
    >
      <MobileToggle serverId={serverId} />
      {isChannelType.success && Icon ? (
        <Icon className={"mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400"} />
      ) : null}
      {type === ServerSideBarTypes.MEMBER && imgUrl ? (
        <MemberAvatar
          src={imgUrl}
          alt={name}
          className={"mr-2 h-8 w-8 md:h-8 md:w-8"}
        />
      ) : null}
      <p className={"text-md font-semibold text-black dark:text-white"}>
        {name}
      </p>
      <div className="ml-auto">
        <SocketIndicator />
      </div>
    </div>
  );
}
