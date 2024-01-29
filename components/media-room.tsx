"use client";

import "@livekit/components-styles";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { VideoConference, LiveKitRoom } from "@livekit/components-react";
import { useRouter } from "next/navigation";

type MediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!user) return router.push("/");
    (async () => {
      try {
        const resp = await axios(
          `/api/get-participant-token?room=${chatId}&username=${user.fullName}`,
        );
        const { data } = resp;
        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user?.fullName, chatId]);

  if (!token)
    return (
      <div className={"flex flex-1 flex-col items-center justify-center"}>
        <Loader2 className={"my-4 h-7 w-7 animate-spin text-zinc-500"} />
        <p className={"text-sm text-zinc-500 dark:text-zinc-400"}>Loading...</p>
      </div>
    );

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
