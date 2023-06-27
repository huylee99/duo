import * as z from "zod";

const facebookRegex = /(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;
const instagramRegex = /(?:https?:\/\/)?(?:www\.)?(m\.instagram|instagram)\.(com)\/(?:(?:\w\.)*#!\/)?(\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;
const discordRegex = /(?:https?:\/\/)?(?:www\.)?(discord)\.(gg)\/(?:(?:\w\.)*#!\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/;

const updateProfileValidatorSchema = z.object({
  name: z.string().trim().max(32).optional(),
  shortBio: z.string().max(64).optional(),
});

const updateSingleImageValidatorSchema = z.object({
  image: z.string().min(1),
});

const updateLongBioValidatorSchema = z.object({
  longBio: z.string().max(2000).optional(),
});

const updateUsernameValidatorSchema = z.object({
  username: z
    .string()
    .min(1, "Username không được để trống.")
    .max(32)
    .regex(/(^[a-zA-Z0-9]*$)/, "Username không được chứa khoảng trống, kí tự đặc biệt."),
});

const updateSocialsValidatorSchema = z.object({
  facebook: z
    .string()
    .optional()
    .refine(value => {
      if (!!value) {
        return facebookRegex.test(value);
      }

      return true;
    }),
  instagram: z
    .string()
    .optional()
    .refine(value => {
      if (!!value) {
        return instagramRegex.test(value);
      }

      return true;
    }),
  discord: z
    .string()
    .optional()
    .refine(value => {
      if (!!value) {
        return discordRegex.test(value);
      }

      return true;
    }),
});

export type UpdateUsernameFields = z.infer<typeof updateUsernameValidatorSchema>;
export type UpdateProfileFields = z.infer<typeof updateProfileValidatorSchema>;
export type UpdateSocialsFields = z.infer<typeof updateSocialsValidatorSchema>;

export { updateProfileValidatorSchema, updateSocialsValidatorSchema, updateUsernameValidatorSchema, updateSingleImageValidatorSchema, updateLongBioValidatorSchema };
