import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ServerSidebar } from "@/components/server";
import { NavigationSidebar } from "@/components/navigation";

type MobileToggleProps = {
  serverId: string;
};

export const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className={"md:hidden"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className={"flex gap-0 bg-[#F2F3F5] p-0 dark:bg-[#2B2D31]"}
        hideCloseButton={true}
      >
        <div className={"w-[72px]"}>
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
