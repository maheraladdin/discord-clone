import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is missing" });
    }

    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server is not founded" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res
        .status(404)
        .json({ message: "Channel is not founded in Server" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "Member is not founded in server" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
