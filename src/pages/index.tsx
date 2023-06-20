import { useSession } from "next-auth/react";
import { NextPageWithLayout } from "./_app";
import CommonLayout from "~/layout/common-layout";

const Home: NextPageWithLayout = () => {
  const { data } = useSession();

  return <div>hello</div>;
};

Home.getLayout = (page: React.ReactElement) => {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
