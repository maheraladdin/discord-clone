"use client";

import { useSocket } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SocketIndicator() {
  const { isConnected } = useSocket();

  return (
    <Badge
      variant={"outline"}
      className={cn(
        "border-none text-white",
        isConnected ? "bg-emerald-600" : "bg-yellow-600",
      )}
    >
      {isConnected ? "Live: Real-time updates" : "Fallback: polling every 1s"}
    </Badge>
  );
}
