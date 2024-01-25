"use client";
import { useParams, useRouter } from "next/navigation";
import { Member, Profile, Server } from "@prisma/client";

import { cn } from "@/lib/utils";
import { roleIconMap } from "@/components/types";
import MemberAvatar from "@/components/member-avater";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
};

export default function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleClick = () => {
    router.push(`/server/${server.id}/conversation/${member.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition-all hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <MemberAvatar
        src={member.profile.imgUrl}
        alt={member.profile.name}
        className={"h-8 w-8"}
      />
      <p
        className={cn(
          "line-clamp-1 text-sm font-semibold text-zinc-500 transition-all group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
}
