"use client";

import React from "react";
import { Search } from "lucide-react";
import { SearchTypes } from "@/components/types";

type ServerSearchProps = {
  data: {
    label: string;
    type: SearchTypes;
    data?: {
      icon: React.ReactNode;
      name: string;
      id: string;
    }[];
  }[];
};
export default function ServerSearch({ data }: ServerSearchProps) {
  return (
    <>
      <button
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
        <kbd>
          <span>CMD</span>K
        </kbd>
      </button>
    </>
  );
}
