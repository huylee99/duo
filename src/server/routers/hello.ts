import { publicProcedure } from "../trpc";

const hello = publicProcedure.query(() => {
  return "Hello World!";
});

export { hello };
