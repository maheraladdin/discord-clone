import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: {
          not: user.id,
        },
        members: {
          some: {
            profileId: user.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: user.id,
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[SERVER_ID_LEAVE_SERVER_PATCH_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
