import { Fragment } from "react";
import PageHeader from "~/components/common/page-header";
import AddDiscount from "~/components/dashboard/discounts/add-discount";
import { NextPageWithLayout } from "../_app";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";
import { api } from "~/server/utils/api";
import DiscountCard from "~/components/dashboard/discounts/discount-card";

const Discounts: NextPageWithLayout = () => {
  const { isLoading, data } = api.discount.getMany.useQuery();
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <PageHeader>Khuyến mãi</PageHeader>
        <AddDiscount />
      </div>

      {!isLoading && data && (
        <div className="grid gap-4 grid-cols-4">
          {data.map(discount => (
            <DiscountCard key={discount.id} discount={discount} />
          ))}
        </div>
      )}
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
