"use client";
import { Member } from "@prisma/client";
import { Loader2 } from "lucide-react";

import { ChatWelcome } from "@/components/chat";
import { useChatQuery } from "@/hooks/use-chat-query";

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
  return (
    <div className={"flex flex-1 flex-col overflow-y-auto py-4"}>
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
    </div>
  );
}
