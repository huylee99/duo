import { NextPageWithLayout } from "./_app";
import CommonLayout from "~/layout/common-layout";

const Home: NextPageWithLayout = () => {
  return null;
};

Home.getLayout = (page: React.ReactElement) => {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Home;
