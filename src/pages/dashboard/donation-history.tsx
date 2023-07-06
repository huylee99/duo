import PageHeader from "~/components/common/page-header";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";
import { NextPageWithLayout } from "../_app";
import DonationHistoryTable from "~/components/dashboard/donation-history-table";

const DuoHistory: NextPageWithLayout = () => {
  return (
    <div>
      <PageHeader className="mb-4 lg:mb-8">Lịch sử donate</PageHeader>
      <DonationHistoryTable />
    </div>
  );
};

DuoHistory.getLayout = (page: React.ReactElement) => {
  return (
    <CommonLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </CommonLayout>
  );
};

export default DuoHistory;
