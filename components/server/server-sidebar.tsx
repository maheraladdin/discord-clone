import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import {
  ServerHeader,
  ServerSearch,
  ServerSection,
  ServerChannel,
  ServerMember,
} from "@/components/server";
import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { iconMap, roleIconMap, ServerSideBarTypes } from "@/components/types";

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
                type: ServerSideBarTypes.CHANNEL,
                data: channels.text.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: ServerSideBarTypes.CHANNEL,
                data: channels.audio.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: ServerSideBarTypes.CHANNEL,
                data: channels.video.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: ServerSideBarTypes.MEMBER,
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className={"my-2 rounded-md bg-zinc-200 dark:bg-zinc-700"} />
        {!!channels.text.length && (
          <div className={"mb-2 "}>
            <ServerSection
              label={"Text Channels"}
              role={userRole}
              sectionType={ServerSideBarTypes.CHANNEL}
              channelType={ChannelType.TEXT}
            />
            <div className="space-y-2">
              {channels.text.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={userRole}
                />
              ))}
            </div>
          </div>
        )}
        {!!channels.audio.length && (
          <div className={"mb-2 "}>
            <ServerSection
              label={"Audio Channels"}
              role={userRole}
              sectionType={ServerSideBarTypes.CHANNEL}
              channelType={ChannelType.AUDIO}
            />
            <div className="space-y-2">
              {channels.audio.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={userRole}
                />
              ))}
            </div>
          </div>
        )}
        {!!channels.video.length && (
          <div className={"mb-2 "}>
            <ServerSection
              label={"Video Channels"}
              role={userRole}
              sectionType={ServerSideBarTypes.CHANNEL}
              channelType={ChannelType.VIDEO}
            />
            <div className="space-y-2">
              {channels.video.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={userRole}
                />
              ))}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className={"mb-2 "}>
            <ServerSection
              label={"Members"}
              role={userRole}
              sectionType={ServerSideBarTypes.MEMBER}
              server={server}
            />
            <div className="space-y-2">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
