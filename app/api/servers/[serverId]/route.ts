import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function DELETE(
  _: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const server = await prisma.server.delete({
      where: { id: serverId, profileId: user.id },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[SERVER_ID_DELETE_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID is Missing", { status: 400 });

    const { name, imgUrl } = await req.json();

    if (!name || !imgUrl)
      return new NextResponse("Missing name or imgUrl", { status: 400 });

    const server = await prisma.server.update({
      where: { id: serverId, profileId: user.id },
      data: {
        name,
        imgUrl,
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[SERVER_ID_PATCH_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
