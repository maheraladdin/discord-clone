import { Server as NetServer } from "http";
import type { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (_: NextApiRequest, res: NextApiResponseServerIo) => {
  // make sure to only create it once
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    // create io instance once for all requests
    res.socket.server.io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
  }

  res.end();
};

export default ioHandler;
