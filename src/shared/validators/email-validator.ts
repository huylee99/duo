import * as z from "zod";

export const emailValidator = z.object({
  email: z.string().email(),
});

export type Email = z.infer<typeof emailValidator>;
