import { env } from "~/env.mjs";
import PusherClient from "pusher-js";

const pusherClient = new PusherClient(env.NEXT_PUBLIC_APP_KEY, {
  cluster: env.NEXT_PUBLIC_APP_CLUSTER,
  channelAuthorization: {
    endpoint: "/api/pusher/auth-channel",
    transport: "ajax",
  },
  userAuthentication: {
    endpoint: "/api/pusher/auth-user",
    transport: "ajax",
  },
});

export { pusherClient };
