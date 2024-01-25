import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { MemberRole } from ".prisma/client";

export async function DELETE(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!channelId)
      return new NextResponse("Channel ID is Missing", { status: 400 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: user.id,
            role: {
              not: MemberRole.GUEST,
            },
          },
        },
      },
      data: {
        channels: {
          deleteMany: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[CHANNEL_ID_DELETE_ERROR]: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { channelId } }: { params: { channelId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!channelId)
      return new NextResponse("Channel ID is Missing", { status: 400 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const { name, type } = await req.json();
    if (!name)
      return new NextResponse("Channel Name is Missing", { status: 400 });
    if (name === "general")
      return new NextResponse("Channel Name can't be general", { status: 400 });
    if (!type)
      return new NextResponse("Channel Type is Missing", { status: 400 });

    const server = await prisma.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: user.id,
            role: {
              not: MemberRole.GUEST,
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[CHANNEL_ID_PATCH_ERROR]: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
