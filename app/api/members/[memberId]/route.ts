import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!memberId)
      return new NextResponse("Member Id is missing", { status: 400 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });

    const server = await prisma.server.update({
      where: { id: serverId, profileId: user.id },
      data: {
        members: {
          delete: { id: memberId, profileId: { not: user.id } },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[MEMBERS_ID_DELETE]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } },
) {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    if (!memberId)
      return new NextResponse("Member Id is missing", { status: 400 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });

    const { role } = await req.json();
    if (!role) return new NextResponse("Role is missing", { status: 400 });

    const server = await prisma.server.update({
      where: { id: serverId, profileId: user.id },
      data: {
        members: {
          update: {
            where: { id: memberId, profileId: { not: user.id } },
            data: { role },
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { role: "asc" },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("[MEMBERS_ID_PATCH]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
