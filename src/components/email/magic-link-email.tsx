import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";
import { env } from "~/env.mjs";

interface MagicLinkEmailProps {
  magicLink: string;
}

const baseUrl = env.NODE_ENV === "production" ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const MagicLinkEmail = (props: MagicLinkEmailProps) => {
  const previewText = `Đây là link đăng nhập vào vnpal.gg. Vui lòng kiểm tra email và đăng nhập.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img src={`${baseUrl}/vercel.svg`} width="40" height="37" alt="Vercel" className="my-0 mx-auto" />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Link đăng nhập</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Chào bạn 🎉🎉,</Text>
            <Text className="text-black text-[14px] leading-[24px]">Vui lòng ấn vào nút bên dưới để đăng nhập</Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button pX={20} pY={12} className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center" href={props.magicLink}>
                Đăng nhập
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              hoặc copy và truy cập đường dẫn này trên trình duyệt:{" "}
              <Link href={props.magicLink} className="text-blue-600 no-underline">
                {props.magicLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[14px] leading-[24px]">&copy; {new Date().getFullYear()} Deux Labs.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
