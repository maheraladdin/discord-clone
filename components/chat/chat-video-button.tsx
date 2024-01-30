"use client";

import qs from "query-string";
import { Video, VideoOff } from "lucide-react";
import { ActionTooltip } from "@/components/tooltips";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ChatVideoButton() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const tooltip = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
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
