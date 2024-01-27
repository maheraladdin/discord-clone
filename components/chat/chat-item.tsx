"use client";

import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import { FileIcon, ShieldAlert, ShieldCheck } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";

import MemberAvatar from "@/components/member-avatar";
import { ActionTooltip } from "@/components/tooltips";

type ChatItemProps = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isEdited: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ActionTooltip label={"Moderator"}>
      <ShieldCheck className={"ml-2 h-4 w-4 text-indigo-500"} />
    </ActionTooltip>
  ),
  [MemberRole.ADMIN]: (
    <ActionTooltip label={"Admin"}>
      <ShieldAlert className={"ml-2 h-4 w-4 text-rose-500"} />
    </ActionTooltip>
  ),
};

export default function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isEdited,
  socketUrl,
  socketQuery,
}: ChatItemProps) {
  // membership status
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMsg = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMsg = !deleted && isOwner && !fileUrl;

  // file type status
  const isPdf = fileUrl && /\.(pdf)$/i.test(fileUrl);
  const isAudio = fileUrl && /\.(mp3|wav)$/i.test(fileUrl);
  const isImage = fileUrl && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileUrl);
  const isContent = !isPdf && !isAudio && !isImage;
  return (
    <div
      className={
        "group relative flex w-full items-center p-4 transition hover:bg-black/5"
      }
    >
      <div className="group flex w-full items-start gap-x-2">
        <div className={"cursor-pointer transition hover:drop-shadow-md"}>
          <MemberAvatar src={member.profile.imgUrl} alt={member.profile.name} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className={
                  "cursor-pointer text-sm font-semibold hover:underline "
                }
              >
                {member.profile.name}
              </p>
              {roleIconMap[member.role]}
            </div>
            <span className={"text-xs text-zinc-500 dark:text-zinc-400"}>
              {timestamp}
            </span>
          </div>
          {isContent ? content : null}
          {isImage ? (
            <>
              <a
                href={fileUrl}
                rel={"noopener noreferrer"}
                target={"_blank"}
                className={
                  "relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
                }
              >
                <Image
                  src={fileUrl}
                  alt={content}
                  fill
                  className={"object-cover"}
                />
              </a>
            </>
          ) : null}
          {isAudio ? (
            <div className={"max-w-sm pt-2"}>
              <AudioPlayer
                src={fileUrl}
                className={"dark:bg-secondary-foreground"}
              />
            </div>
          ) : null}
          {isPdf ? (
            <div
              className={
                "relative mt-2 flex w-fit items-center rounded-md bg-background/10 p-2"
              }
            >
              <a
                href={fileUrl}
                target={"_blank"}
                rel={"noopener noreferrer"}
                className={
                  "darK:text-indigo-400 flex flex-col items-center justify-center gap-y-4 text-center text-sm font-medium text-indigo-500 hover:underline"
                }
              >
                <FileIcon
                  className={"h-10 w-10 fill-indigo-200 stroke-indigo-400"}
                />
                PDF File
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
