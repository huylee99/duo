import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import Nav from "~/components/common/nav";

const CommonLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  return (
    <>
      <Nav />
      {children}
    </>
  );
};

export default CommonLayout;
