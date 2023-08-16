import { NextPageWithLayout } from "../_app";
import CommonLayout from "~/layout/common-layout";
import PageHeader from "~/components/common/page-header";
import { formatPrice } from "~/utils/format-price";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import TransactionHistoryTable from "~/components/wallet/transaction-history-table";
import LineChart from "~/components/common/chart";
import { ParentSize } from "@visx/responsive";
import Link from "next/link";

const Wallet: NextPageWithLayout = () => {
  return (
    <div className="container my-16">
      <PageHeader className="my-16">Ví</PageHeader>
      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-48 bg-primary-foreground rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <h2 className="text-xl font-medium text-muted-foreground">Số dư hiện tại</h2>
          <span className="text-4xl font-semibold">{formatPrice(200000)}</span>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-muted-foreground">12%</span>
              <Button className="bg-pink-600 text-white hover:bg-pink-700" size={"lg"} asChild>
                <Link href={"/wallet/recharge"}>Nạp thêm</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-1 h-48">
          <div className="flex-1 h-full bg-primary-foreground rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <h2 className="text-xl font-medium text-muted-foreground">Đã nạp</h2>
            <span className="text-4xl font-semibold">{formatPrice(100000)}</span>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-muted-foreground">12%</span>
            </div>
          </div>
          <div className="flex-1 h-full bg-primary-foreground rounded-lg p-6 shadow-sm flex flex-col justify-between">
            <h2 className="text-xl font-medium text-muted-foreground">Chi tiêu</h2>
            <span className="text-4xl font-semibold">{formatPrice(100000)}</span>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-muted-foreground">12%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-primary-foreground rounded-lg mb-16 shadow-sm">
        <h2 className="text-xl font-medium text-muted-foreground mb-8">Lịch sử giao dịch</h2>
        <TransactionHistoryTable />
      </div>

      <div className="p-6 bg-primary-foreground rounded-lg shadow-sm">
        <h2 className="text-xl font-medium text-muted-foreground mb-8">Biểu đồ</h2>
        <ParentSize className="!h-[400px] w-full">{({ width, height }) => <LineChart height={height} width={width} />}</ParentSize>
      </div>
    </div>
  );
};

Wallet.getLayout = function getLayout(page) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Wallet;
