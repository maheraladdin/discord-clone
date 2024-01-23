import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  _: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const server = await prisma.server.update({
      where: { id: serverId, profileId: user.id },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[SERVER_ID_GENERATE_NEW_INVITE_LINK_PATCH_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
