import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { ServerSidebar } from "@/components/server";

type ServerIdLayoutProps = {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
};

export default async function ServerIdLayout({
  children,
  params: { serverId },
}: ServerIdLayoutProps) {
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className={"h-full md:pl-60"}>{children}</main>
    </div>
  );
}
