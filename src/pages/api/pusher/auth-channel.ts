import type { NextApiResponse, NextApiRequest } from "next";
import { pusherServer } from "~/lib/pusher-server";
import { getServerAuthSession } from "~/server/utils/auth";

export default async function pusherAuthEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.socket_id || !req.body.channel_name) {
    return res.status(400).end();
  }

  const { socket_id, channel_name } = req.body;

  const auth = await getServerAuthSession({ req, res });

  if (!auth) {
    return res.status(401).end();
  }

  const presenceData = {
    user_id: auth.user.id,
  };

  const pusherAuth = pusherServer.authorizeChannel(socket_id, channel_name, presenceData);

  return res.send(pusherAuth);
}
