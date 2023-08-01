import Pusher from "pusher";
import { env } from "~/env.mjs";

const pusherServer = new Pusher({
  appId: env.APP_ID,
  key: env.APP_KEY,
  secret: env.APP_SECRET,
  cluster: env.APP_CLUSTER,
});

export { pusherServer };
