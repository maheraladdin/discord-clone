import { startCase } from "lodash";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { memberId: string };
}) {
  const member = await prisma.member.findUnique({
    where: {
      id: params.memberId,
    },
    include: {
      profile: true,
    },
  });

  return {
    title: startCase(member?.profile?.name || "conversation"),
    description: "Chatting with your friend",
  };
}
export default function MemberIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
