"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const joinServerAction = async (inviteCode: string, userId: string) => {
  const server = await prisma.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: userId,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/server/${server?.id}`);
};
