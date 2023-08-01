import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServer } from "~/lib/pusher-server";
import { getServerAuthSession } from "~/server/utils/auth";

export default async function pusherAuthEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.socket_id) {
    return res.status(400).end();
  }

  const { socket_id } = req.body;

  const auth = await getServerAuthSession({ req, res });

  if (!auth) {
    return res.status(401).end();
  }

  const presenceData = {
    id: auth.user.id,
  };

  const pusherAuth = pusherServer.authenticateUser(socket_id, presenceData);

  return res.send(pusherAuth);
}
