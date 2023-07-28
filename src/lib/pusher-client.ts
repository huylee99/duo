import { env } from "~/env.mjs";
import PusherClient from "pusher-js";

const pusherClient = new PusherClient(env.NEXT_PUBLIC_APP_KEY, {
  cluster: env.NEXT_PUBLIC_APP_CLUSTER,
});

export { pusherClient };
