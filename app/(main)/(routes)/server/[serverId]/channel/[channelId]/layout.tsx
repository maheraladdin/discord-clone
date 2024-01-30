import { startCase } from "lodash";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { channelId: string };
}) {
  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  return {
    title: startCase(channel?.name || "channel"),
    description: "Chatting with your friends in Channel",
  };
}
export default function ChannelIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
