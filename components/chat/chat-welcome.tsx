import { Hash } from "lucide-react";

type ChatWelcomeProps = {
  type: "channel" | "conversation";
  name: string;
};

export default function ChatWelcome({ type, name }: ChatWelcomeProps) {
  return (
    <div className={"mb-4 space-y-2 px-4"}>
      {type === "channel" ? (
        <div
          className={
            "flex h-[75px] w-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700"
          }
        >
          <Hash className={"h-12 w-12 text-white"} />
        </div>
      ) : null}
      <p className={"text-xl font-bold md:text-3xl"}>
        {type === "channel" ? "Welcome to #" : ""}
        {name}.
      </p>
      <p className={"text-sm text-zinc-600 dark:text-zinc-400"}>
        {type === "channel"
          ? `This is the beginning of the #${name} channel.`
          : `This is the beginning of your conversation with ${name}.`}
      </p>
    </div>
  );
}
