"use client";

import { z } from "zod";
import axios from "axios";
import qs from "query-string";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { usePlatform } from "react-use-platform";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { useEffectOnce, useEventListener } from "usehooks-ts";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MemberAvatar from "@/components/member-avatar";
import { ActionTooltip } from "@/components/tooltips";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

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

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message can't be longer than 2000 characters"),
});

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
  const platform = usePlatform();
  const openModel = useModalStore((state) => state.openModal);
  const router = useRouter();
  // membership status
  const isOwner = currentMember.id === member.id;
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;

  // deleted status
  const canDeleteMsg = !deleted && (isAdmin || isModerator || isOwner);

  // edited status
  const canEditMsg = !deleted && isOwner && !fileUrl;
  const [isEditing, setIsEditing] = useState(false);

  // file type status
  const isPdf = fileUrl && /\.(pdf)$/i.test(fileUrl);
  const isAudio = fileUrl && /\.(mp3|wav)$/i.test(fileUrl);
  const isImage = fileUrl && /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileUrl);
  const isContent = !fileUrl && !isEditing;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    reset({
      content,
    });
  }, [content]);

  const onClickMember = () => {
    const { serverId, id } = member;
    if (id === currentMember.id) return;
    console.log("clicked");
    router.push(`/server/${serverId}/conversation/${id}`);
  };

  useEffectOnce(() => {
    router.prefetch(`/server/${member?.serverId}/conversation/${member.id}`);
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.content === content) {
      setIsEditing(false);
      return;
    }
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const CancelEditing = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditing(false);
    }
  };

  useEventListener("keydown", CancelEditing);

  return (
    <div
      className={
        "group relative flex w-full items-center p-4 transition hover:bg-black/5"
      }
    >
      <div className="group flex w-full items-start gap-x-2">
        <div
          onClick={onClickMember}
          role={"button"}
          className={"transition hover:drop-shadow-md"}
        >
          <MemberAvatar src={member.profile.imgUrl} alt={member.profile.name} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onClickMember}
                role={"button"}
                className={"text-sm font-semibold hover:underline "}
              >
                {member.profile.name}
              </p>
              {roleIconMap[member.role]}
            </div>
            <span className={"text-xs text-zinc-500 dark:text-zinc-400"}>
              {timestamp}
            </span>
          </div>
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
          {isContent ? (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted
                  ? "mt-1 text-xs italic text-zinc-500 dark:text-zinc-400"
                  : "",
              )}
            >
              {content}
              {isEdited && !deleted ? (
                <span
                  className={
                    "mx-2 text-[10px] text-zinc-500 dark:text-zinc-400"
                  }
                >
                  (edited)
                </span>
              ) : null}
            </p>
          ) : null}
          {!fileUrl && isEditing ? (
            <Form {...form}>
              <form
                className={"flex w-full items-center gap-x-2 pt-2"}
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormField
                  {...register("content")}
                  render={({ field }) => {
                    return (
                      <FormItem className={"flex-1"}>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isSubmitting}
                              className={
                                "border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                              }
                              placeholder={"Editing  Message..."}
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Button disabled={isSubmitting} size={"sm"} variant={"primary"}>
                  Save
                </Button>
              </form>
              {platform === "mac" || platform === "windows" ? (
                <span className={"mt-1 text-[10px] text-zinc-400"}>
                  Press{" "}
                  <kbd
                    className={
                      "pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                    }
                  >
                    Esc
                  </kbd>{" "}
                  to cancel
                </span>
              ) : null}
            </Form>
          ) : null}
        </div>
      </div>
      {canDeleteMsg ? (
        <div
          className={
            "absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800"
          }
        >
          {canEditMsg ? (
            <ActionTooltip label={"Edit"}>
              <Edit
                onClick={() => setIsEditing(true)}
                className={
                  "ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition-all hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
                }
              />
            </ActionTooltip>
          ) : null}
          <ActionTooltip label={"Delete"}>
            <Trash
              onClick={() =>
                openModel(ModalType.DELETE_MESSAGE, {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className={
                "ml-auto h-4 w-4 cursor-pointer text-rose-500 transition-all hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
              }
            />
          </ActionTooltip>
        </div>
      ) : null}
    </div>
  );
}
