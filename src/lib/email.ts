import { Resend } from "resend";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_KEY);

export const sendEmail = (props: { to: string; from: string; subject: string; react: React.ReactElement }) => {
  return resend.emails.send({
    from: props.from,
    to: props.to,
    subject: props.subject,
    react: props.react,
  });
};
