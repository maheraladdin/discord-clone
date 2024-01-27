import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Server, Member, Profile, Message } from "@prisma/client";

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
