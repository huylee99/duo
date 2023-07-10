import { NextPageWithLayout } from "../_app";
import { Fragment } from "react";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";
import PageHeader from "~/components/common/page-header";
import ServiceCard from "~/components/dashboard/service-card";

const Services: NextPageWithLayout = () => {
  return (
    <Fragment>
      <PageHeader className="mb-4 lg:mb-8">Dịch vụ</PageHeader>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <ServiceCard key={index} />
        ))}
      </div>
    </Fragment>
  );
};

Services.getLayout = function getLayout(page) {
  return (
    <CommonLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </CommonLayout>
  );
};

export default Services;
