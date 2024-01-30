"use client";

import qs from "query-string";
import { Mic, MicOff } from "lucide-react";
import { ActionTooltip } from "@/components/tooltips";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ChatAudioButton() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAudio = searchParams?.get("audio");
  const Icon = isAudio ? MicOff : Mic;
  const tooltip = isAudio ? "End voice call" : "Start voice call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true },
    );
    router.push(url);
  };

  return (
    <ActionTooltip label={tooltip} side={"bottom"}>
      <button onClick={onClick} className={"mr-4 transition hover:opacity-75"}>
        <Icon className={"h-6 w-6 text-zinc-500 dark:text-zinc-400"} />
      </button>
    </ActionTooltip>
  );
}
