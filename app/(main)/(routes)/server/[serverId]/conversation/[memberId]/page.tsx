import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader, ChatInput, ChatMessages } from "@/components/chat";
import { ServerSideBarTypes } from "@/components/types";

type MemberIdPageProps = {
  params: {
    serverId: string;
    memberId: string;
  };
};

export default async function MemberIdPage({
  params: { serverId, memberId },
}: MemberIdPageProps) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  const currentMember = await prisma.member.findFirst({
    where: {
      profileId: user.id,
      serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId,
  );

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;

  // the person who will receive the message
  const otherMember = memberOne.id === user.id ? memberTwo : memberOne;

  return (
    <div className={"flex h-full flex-col bg-white dark:bg-[#313338]"}>
      <ChatHeader
        name={otherMember.profile.name}
        imgUrl={otherMember.profile.imgUrl}
        serverId={serverId}
        type={ServerSideBarTypes.MEMBER}
      />
      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        type={"conversation"}
        apiUrl={"/api/direct-messages"}
        socketUri={"/api/socket/direct-messages"}
        socketQuery={{
          conversationId: conversation.id,
        }}
        chatId={conversation.id}
        paramKey={"conversationId"}
        paramValue={conversation.id}
      />
      <ChatInput
        apiUrl={`/api/socket/direct-messages`}
        query={{
          conversationId: conversation.id,
        }}
        name={otherMember.profile.name}
        type={ServerSideBarTypes.MEMBER}
      />
    </div>
  );
}
