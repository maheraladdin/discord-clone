"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ServerSideBarTypes } from "@/components/types";
import { usePlatform } from "react-use-platform";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { useEventListener } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";

type ServerSearchProps = {
  data: {
    label: string;
    type: ServerSideBarTypes;
    data?: {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[];
  }[];
};
export default function ServerSearch({ data }: ServerSearchProps) {
  const platform = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const searchOnKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      setIsOpen((open) => !open);
    }
  };

  useEventListener("keydown", searchOnKeyDown);

  const onSelectCommandItem = (id: string, type: ServerSideBarTypes) => {
    setIsOpen(false);
    switch (type) {
      case ServerSideBarTypes.CHANNEL:
        router.push(`/server/${params.serverId}/channel/${id}`);
        break;
      case ServerSideBarTypes.MEMBER:
        router.push(`/server/${params.serverId}/conversation/${id}`);
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          "group flex w-full items-center gap-x-2 rounded-md p-2 transition-all hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
        }
      >
        <Search className={"h-4 w-4 text-zinc-500 dark:text-zinc-400"} />
        <p
          className={
            "text-sm font-semibold text-zinc-500 transition-all group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300"
          }
        >
          Search
        </p>
        {(platform === "mac" || platform === "windows") && (
          <kbd
            className={
              "pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
            }
          >
            <span className={"text-xs"}>
              {platform === "mac" ? "⌘" : "CTRL + "}
            </span>
            K
          </kbd>
        )}
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          autoFocus
          placeholder={"Search all channels and members"}
        />
        <CommandList>
          <CommandEmpty>No Result Found</CommandEmpty>
          {data.map(({ label, type, data }) =>
            data?.length ? (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, id, name }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => onSelectCommandItem(id, type)}
                  >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null,
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
