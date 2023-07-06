import CommonLayout from "~/layout/common-layout";
import { NextPageWithLayout } from "../_app";
import DashboardLayout from "~/layout/dashboard-layout";

const Dashboard: NextPageWithLayout = () => {
  return <div>Hello</div>;
};

Dashboard.getLayout = (page: React.ReactElement) => {
  return (
    <CommonLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </CommonLayout>
  );
};

export default Dashboard;
