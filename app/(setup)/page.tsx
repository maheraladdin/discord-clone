import initProfile from "@/lib/init-profile";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { InitModal } from "@/components/modals";

export default async function SetupPage() {
  const profile = await initProfile();
  const server = await prisma.server.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    redirect(`/server/${server.id}`);
  }
  return <InitModal />;
}
