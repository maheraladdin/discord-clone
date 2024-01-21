"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/tooltips";

type NavigationItemProps = {
  id: string;
  name: string;
  imgUrl: string;
};

export default function NavigationItem({
  id,
  name,
  imgUrl,
}: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/server/${id}`);
  };
  return (
    <ActionTooltip label={name} side={"right"} align={"center"}>
      <button
        onClick={handleClick}
        className={"group relative flex items-center"}
      >
        <div
          className={cn(
            "absolute left-0 w-[4px] rounded-r-full bg-primary transition-all",
            params.serverId === id
              ? "h-[36px]"
              : "h-[8px] group-hover:h-[20px]",
          )}
        />
        <div
          className={cn(
            "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
            params.serverId === id &&
              "rounded-[16px] bg-primary/10 text-primary",
          )}
        >
          <Image
            src={imgUrl}
            alt={`${name} server`}
            fill
            objectFit={"cover"}
            sizes={"48px"}
          />
        </div>
      </button>
    </ActionTooltip>
  );
}
