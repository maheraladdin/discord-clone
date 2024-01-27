"use client";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";

export default function ClerkUser() {
  const { resolvedTheme } = useTheme();
  return (
    <UserButton
      afterSignOutUrl={"/"}
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          avatarBox: "h-[48px] w-[48px]",
        },
      }}
    />
  );
}
