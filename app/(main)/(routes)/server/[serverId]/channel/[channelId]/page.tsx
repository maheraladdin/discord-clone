import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat";

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
    </div>
  );
}
