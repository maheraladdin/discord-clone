"use client";
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();
  return (
    <SignUp
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
