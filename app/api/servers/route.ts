import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

import prisma from "@/lib/prisma";
import { MemberRole } from ".prisma/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { name, imgUrl } = await req.json();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await prisma.server.create({
      data: {
        profileId: user.id,
        name,
        imgUrl,
        Channels: {
          create: [{ name: "general", profileId: user.id }],
        },
        Members: {
          create: [{ profileId: user.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
