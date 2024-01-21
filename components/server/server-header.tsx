"use client";

import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import { ServerWithMembersAndProfiles } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalType, useModalStore } from "@/hooks/use-modal-store";

type ServerHeaderProps = {
  role?: MemberRole;
  server: ServerWithMembersAndProfiles;
};

export default function ServerHeader({ role, server }: ServerHeaderProps) {
  const openModel = useModalStore((state) => state.openModal);
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"focus:outline-none"} asChild>
        <button
          className={
            "text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition-all hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50"
          }
        >
          {server.name}
          <ChevronDown className={"ml-auto h-5 w-5"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400"
        }
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => openModel(ModalType.INVITE_PEOPLE, { server })}
            className={
              "cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
            }
          >
            Invite People
            <UserPlus className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => openModel(ModalType.EDIT_SERVER, { server })}
              className={"cursor-pointer px-3 py-2 text-sm"}
            >
              Server Settings
              <Settings className={"ml-auto h-4 w-4"} />
            </DropdownMenuItem>
            <DropdownMenuItem className={"cursor-pointer px-3 py-2 text-sm"}>
              Manage Members
              <Users className={"ml-auto h-4 w-4"} />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && (
          <>
            <DropdownMenuItem className={"cursor-pointer px-3 py-2 text-sm"}>
              Create Channel
              <PlusCircle className={"ml-auto h-4 w-4"} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className={"cursor-pointer px-3 py-2 text-sm text-rose-500"}
          >
            Delete Server
            <Trash className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className={"cursor-pointer px-3 py-2 text-sm text-rose-500"}
          >
            Leave Server
            <LogOut className={"ml-auto h-4 w-4"} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
