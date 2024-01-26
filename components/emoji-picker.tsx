"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsClient } from "usehooks-ts";

type EmojiPickerProps = {
  children: React.ReactNode;
  onChange: (emoji: string) => void;
  className?: {
    trigger?: string;
    content?: string;
  };
};

export function EmojiPicker({
  children,
  onChange,
  className,
}: EmojiPickerProps) {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <Popover>
      <PopoverTrigger className={className?.trigger}>{children}</PopoverTrigger>
      <PopoverContent
        side={"right"}
        sideOffset={40}
        className={cn(
          "mb-16 border-none bg-transparent shadow-none drop-shadow-none",
          className?.content,
        )}
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: Record<string, any>) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}
