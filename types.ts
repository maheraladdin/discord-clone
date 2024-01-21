import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersAndProfiles = Server & {
  Members: (Member & { profile: Profile })[];
};
