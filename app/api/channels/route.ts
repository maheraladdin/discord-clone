import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";

import prisma from "@/lib/prisma";
import { z } from "zod";

const ChannelTypeSchema = z.nativeEnum(ChannelType);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });

    const { name, type } = await req.json();

    if (!name)
      return new NextResponse("Channel name is missing", { status: 400 });
    if (name === "general")
      return new NextResponse("Channel name can't be 'general'", {
        status: 400,
      });

    if (!type)
      return new NextResponse("Channel Type is missing", { status: 400 });
    const isChannelType = ChannelTypeSchema.safeParse(type);
    if (!isChannelType.success)
      return new NextResponse("Invalid channel type", { status: 400 });

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: user.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[CHANNELS_POST]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
