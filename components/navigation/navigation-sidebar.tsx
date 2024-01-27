import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem, NavigationAction } from "@/components/navigation";
import ClerkUser from "@/components/clerk-user";

export default async function NavigationSidebar() {
  const user = await currentUser();
  if (!user) return redirect("/");
  const { id } = user;

  // get all servers where the user is a member
  const servers = await prisma.server.findMany({
    where: { members: { some: { profileId: id } } },
  });

  return (
    <div
      className={
        "flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]"
      }
    >
      <NavigationAction />
      <Separator
        className={"round-md mx-auto h-[2px] w-10 bg-zinc-300 dark:bg-zinc-700"}
      />
      <ScrollArea className={"w-full flex-1"}>
        {servers.map((server) => {
          const { id, name, imgUrl } = server;
          return (
            <div key={server.id} className={"mb-4"}>
              <NavigationItem name={name} id={id} imgUrl={imgUrl} />
            </div>
          );
        })}
      </ScrollArea>
      <div className={"mt-auto flex flex-col items-center gap-y-4 pb-3"}>
        <ModeToggle />
        <ClerkUser />
      </div>
    </div>
  );
}
