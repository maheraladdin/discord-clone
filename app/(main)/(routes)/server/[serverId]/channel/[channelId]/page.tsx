import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { ServerSideBarTypes } from "@/components/types";
import { ChatHeader, ChatInput, ChatMessages } from "@/components/chat";
import { MediaRoom } from "@/components/media-room";

type ChannelIdPageProps = {
  params: {
    serverId: string;
    channelId: string;
  };
};

export default async function ChannelIdPage({
  params: { serverId, channelId },
}: ChannelIdPageProps) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await prisma.member.findFirst({
    where: {
      serverId,
      profileId: user.id,
    },
  });

  if (!member || !channel) return redirect("/");

  return (
    <div className={"flex h-full flex-col bg-white dark:bg-[#313338]"}>
      <ChatHeader name={channel.name} type={channel.type} serverId={serverId} />
      {channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            type={"channel"}
            apiUrl={"/api/messages"}
            socketUri={"/api/socket/messages"}
            socketQuery={{
              serverId,
              channelId,
            }}
            chatId={channelId}
            paramKey={"channelId"}
            paramValue={channelId}
          />
          <ChatInput
            apiUrl={`/api/socket/messages`}
            query={{
              serverId,
              channelId,
            }}
            name={channel.name}
            type={ServerSideBarTypes.CHANNEL}
          />
        </>
      ) : (
        <MediaRoom
          chatId={channelId}
          video={channel.type === ChannelType.VIDEO}
          audio={
            channel.type === ChannelType.VIDEO ||
            channel.type === ChannelType.AUDIO
          }
        />
      )}
    </div>
  );
}
