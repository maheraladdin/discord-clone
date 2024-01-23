import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerHeader, ServerSearch } from "@/components/server";
import { iconMap, roleIconMap, SearchTypes } from "@/components/types";

type ServerSidebarProps = {
  serverId: string;
};

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      Members: {
        some: {
          profileId: user.id,
        },
      },
    },
    include: {
      Channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) return redirect("/");

  const channels = {
    text: server.Channels.filter(
      (channel) => channel.type === ChannelType.TEXT,
    ),
    audio: server.Channels.filter(
      (channel) => channel.type === ChannelType.AUDIO,
    ),
    video: server.Channels.filter(
      (channel) => channel.type === ChannelType.VIDEO,
    ),
  };

  const members = server.Members.filter(
    (member) => member.profileId !== user.id,
  );

  const userRole = server.Members.find(
    (member) => member.profileId === user.id,
  )?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={userRole} />
      <ScrollArea className={"flex-1 px-3"}>
        <div className={"mt-2 "}>
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: SearchTypes.CHANNEL,
                data: channels.text.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: SearchTypes.CHANNEL,
                data: channels.audio.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: SearchTypes.CHANNEL,
                data: channels.video.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: SearchTypes.MEMBER,
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
