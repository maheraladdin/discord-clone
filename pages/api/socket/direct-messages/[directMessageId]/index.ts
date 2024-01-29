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

    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!directMessageId || !conversationId)
      return res.status(400).json({ error: "Missing query parameters" });

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(404).json({ error: "member not found" });

    let message = await prisma.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversation.id,
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
      message = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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
      message = await prisma.directMessage.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = `chat:${conversation.id}:messages:update`;
    res.socket.server.io.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error in messages/[messageId]/index.ts: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
