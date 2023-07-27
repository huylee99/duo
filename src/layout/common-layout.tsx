import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import Nav from "~/components/common/nav";
import ChatButton from "~/components/chat/chat-button";

const CommonLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  return (
    <>
      <Nav />
      {session.data?.user && <ChatButton />}
      {children}
    </>
  );
};

export default CommonLayout;
