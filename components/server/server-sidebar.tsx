import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { ServerHeader } from "@/components/server";

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

  const otherMembers = server.Members.map(
    (member) => member.profileId !== user.id,
  );

  const userRole = server.Members.find(
    (member) => member.profileId === user.id,
  )?.role;

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={userRole} />
    </div>
  );
}
