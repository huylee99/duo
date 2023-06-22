import * as z from "zod";

const facebookRegex = /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;
const instagramRegex = /(?:https?:\/\/)?(?:www\.)?(m\.instagram|instagram)\.(com)\/(?:(?:\w\.)*#!\/)?(\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;
const discordRegex = /(?:https?:\/\/)?(?:www\.)?(discord)\.(gg)\/(?:(?:\w\.)*#!\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;

const updateProfileValidatorSchema = z.object({
  name: z.string().min(1).max(32),
  shortBio: z.string().min(1).max(64),
});

const updateUsernameValidatorSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(32)
    .regex(/(^[a-zA-Z0-9]*$)/),
});

const updateSocialsValidatorSchema = z.object({
  facebook: z.string().regex(facebookRegex).optional(),
  instagram: z.string().regex(instagramRegex).optional(),
  discord: z.string().regex(discordRegex).optional(),
});

export type UpdateUsernameFields = z.infer<typeof updateUsernameValidatorSchema>;
export type UpdateProfileFields = z.infer<typeof updateProfileValidatorSchema>;
export type UpdateSocialsFields = z.infer<typeof updateSocialsValidatorSchema>;

export { updateProfileValidatorSchema, updateSocialsValidatorSchema, updateUsernameValidatorSchema };
