import { Fragment } from "react";
import PageHeader from "~/components/common/page-header";
import AddDiscount from "~/components/dashboard/discounts/add-discount";
import { NextPageWithLayout } from "../_app";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";

const Discounts: NextPageWithLayout = () => {
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <PageHeader>Khuyến mãi</PageHeader>
        <AddDiscount />
      </div>
    </Fragment>
  );
};

Discounts.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CommonLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </CommonLayout>
  );
};

export default Discounts;
