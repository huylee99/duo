import * as z from "zod";

const authSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải dài hơn 6 ký tự.").max(32, "Mật khẩu không được quá 32 ký tự."),
});

export { authSchema };

export type AuthFields = z.infer<typeof authSchema>;
