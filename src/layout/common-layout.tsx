import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import Nav from "~/components/common/nav";

const CommonLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();
  return (
    <div className="mb-16">
      <Nav />
      {children}
    </div>
  );
};

export default CommonLayout;
