import prisma from "@/lib/prisma";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function ServerIdPage({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/server/${serverId}/channel/${initialChannel?.id}`);
}
