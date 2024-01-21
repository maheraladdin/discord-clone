"use client";
import { Button } from "@/components/ui/button";
import { joinServerAction } from "@/actions/join-server-action";
import { useBoolean } from "usehooks-ts";
import { Loader2 } from "lucide-react";

type JoinButtonProps = {
  inviteCode: string;
  userId: string;
};

export default function JoinButton({ inviteCode, userId }: JoinButtonProps) {
  const { value: loading, toggle } = useBoolean(false);
  const onJoinServer = async () => {
    toggle();
    await joinServerAction(inviteCode, userId);
    toggle();
  };
  return (
    <Button
      disabled={loading}
      onClick={onJoinServer}
      variant={"primary"}
      className={"uppercase"}
    >
      {loading ? <Loader2 className={"h-5 w-5 animate-spin"} /> : "Join"}
    </Button>
  );
}
