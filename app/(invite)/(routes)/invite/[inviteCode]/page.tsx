import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { JoinButton } from "./_components";

type InviteCodePageProps = {
  params: {
    inviteCode: string;
  };
};

const uuidSchema = z.string().uuid();

export default async function InviteCodePage({
  params: { inviteCode },
}: InviteCodePageProps) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const isUuid = uuidSchema.safeParse(inviteCode);
  if (!inviteCode && isUuid.success) return redirect("/");

  const isExistInServer = await prisma.server.findFirst({
    where: {
      inviteCode,
      Members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });
  if (isExistInServer) return redirect(`/server/${isExistInServer.id}`);

  const server = await prisma.server.findUnique({
    where: {
      inviteCode,
    },
  });

  if (!server) return redirect("/");

  return (
    <main className={"flex h-screen w-screen items-center justify-center"}>
      <div
        className={
          "relative flex h-80 w-1/2 flex-col items-center justify-center gap-y-4 rounded-[16px] bg-neutral-300 p-6 dark:bg-neutral-800"
        }
      >
        <div className={"relative h-24 w-24"}>
          <Image
            src={server.imgUrl}
            alt={server.name}
            fill
            sizes={"96px"}
            className={"rounded-[16px]"}
          />
        </div>
        <div className={"text-center"}>
          <h1 className={"text-2xl font-semibold"}>{server.name}</h1>
        </div>
        <JoinButton inviteCode={inviteCode} userId={user.id} />
      </div>
    </main>
  );
}
