import { NextPageWithLayout } from "../_app";
import { Fragment } from "react";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";
import PageHeader from "~/components/common/page-header";
import ServiceCard from "~/components/dashboard/service-card";
import AddService from "../../components/dashboard/services/add-service";
import { api } from "~/server/utils/api";

const Services: NextPageWithLayout = () => {
  const { isLoading, data } = api.service.getMany.useQuery(undefined);

  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <PageHeader>Dịch vụ</PageHeader>
        <AddService />
      </div>
      {!isLoading && data && (
        <div className="grid grid-cols-4 gap-4">
          {data.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
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
