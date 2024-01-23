"use client";

import qs from "query-string";
import { useState } from "react";
import {
  ShieldCheck,
  MoreVertical,
  ShieldQuestion,
  Shield,
  Check,
  Gavel,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";
import { ServerWithMembersAndProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MemberAvatar from "@/components/member-avater";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { roleIconMap } from "@/components/types";

export default function ManageMembersModal() {
  const router = useRouter();
  const { isOpen, type, closeModal, data, openModal } = useModalStore();
  const [loadingId, setLoadingId] = useState<string>("");

  const isModalOpen = isOpen && type === ModalType.MANAGE_MEMBERS;
  const { server } = data as { server: ServerWithMembersAndProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });
      const res = await axios.delete(url);
      router.refresh();
      openModal(ModalType.MANAGE_MEMBERS, { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRuleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });
      const res = await axios.patch(url, { role });
      router.refresh();
      openModal(ModalType.MANAGE_MEMBERS, { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className={"overflow-hidden bg-white text-black"}>
        <DialogHeader className={"px-6 pt-8"}>
          <DialogTitle className={"text-center text-2xl font-bold"}>
            Manage Members
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            {server?.Members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={"mt-8 max-h-[420px] pr-6"}>
          {server?.Members?.map((member) => (
            <div key={member.id} className={"mb-6 flex items-center gap-x-2"}>
              <MemberAvatar
                src={member.profile.imgUrl}
                alt={member.profile.name}
              />
              <div className={"flex flex-col justify-center gap-y-1"}>
                <div className={"flex items-center gap-x-1 text-sm font-bold"}>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className={"text-sm text-zinc-500"}>
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className={"ml-auto"}>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className={"h-4 w-4 text-zinc-500"} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side={"left"}>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className={"flex items-center"}
                          >
                            <ShieldQuestion className={"mr-2 h-4 w-4"} />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={async () => {
                                  if (member.role !== MemberRole.GUEST)
                                    await onRuleChange(
                                      member.id,
                                      MemberRole.GUEST,
                                    );
                                }}
                                disabled={member.role === MemberRole.GUEST}
                              >
                                <Shield className={"mr-2 h-4 w-4"} /> Guest{" "}
                                {member.role === MemberRole.GUEST && (
                                  <Check className={"ml-auto h-4 w-4"} />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  if (member.role !== MemberRole.MODERATOR)
                                    await onRuleChange(
                                      member.id,
                                      MemberRole.MODERATOR,
                                    );
                                }}
                                disabled={member.role === MemberRole.MODERATOR}
                              >
                                <ShieldCheck className={"mr-2 h-4 w-4"} />{" "}
                                Moderator{" "}
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className={"ml-auto h-4 w-4"} />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id)}
                          className={"text-rose-500"}
                        >
                          <Gavel className={"mr-2 h-4 w-4"} /> Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2
                  className={"ml-auto h-4 w-4 animate-spin text-zinc-500"}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
