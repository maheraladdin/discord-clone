import { NextApiRequest } from "next";

import prisma from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { MemberRole } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "DELETE" && req.method !== "PATCH")
    return res.status(405).json({ error: "Method not allowed" });
  try {
    const profile = await currentProfilePages(req);
    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!messageId || !serverId || !channelId)
      return res.status(400).json({ error: "Missing query parameters" });

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

    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) return res.status(404).json({ error: "member not found" });

    let message = await prisma.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channel.id,
        memberId: member.id,
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: "Message not found" });

    const isOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isOwner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "DELETE") {
      message = await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isOwner) return res.status(401).json({ error: "Unauthorized" });
      if (!content)
        return res.status(400).json({ error: "Missing body parameters" });
      message = await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res.socket.server.io.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error in messages/[messageId]/index.ts: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
