import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  return await prisma.profile.findUnique({
    where: {
      id: userId,
    },
  });
};
