"use client";
import { Fragment, useId } from "react";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";

import { MessageWithMemberAndProfile } from "@/types";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ChatItem, ChatWelcome } from "@/components/chat";

type ChatMessagesProps = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUri: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export default function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUri,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  const uniqueId = useId();

  if (isLoading) {
    return (
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <Loader2 className={"my-4 h-7 w-7 animate-spin text-zinc-500"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <ServerCrash className={"my-4 h-7 w-7 text-zinc-500"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>
          Something went wrong.
        </p>
      </div>
    );
  }

  return (
    <div className={"flex flex-1 flex-col overflow-y-auto py-4"}>
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={`${i}-${uniqueId}`}>
            {group.items.map((msg: MessageWithMemberAndProfile) => (
              <ChatItem
                id={msg.id}
                key={msg.id}
                member={msg.member}
                content={msg.content}
                deleted={msg.deleted}
                fileUrl={msg.fileUrl}
                socketUrl={socketUri}
                socketQuery={socketQuery}
                currentMember={msg.member}
                isEdited={msg.createdAt !== msg.updatedAt}
                timestamp={format(new Date(msg.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
