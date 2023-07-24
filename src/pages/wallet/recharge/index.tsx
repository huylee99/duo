import { NextPageWithLayout } from "~/pages/_app";
import PageHeader from "~/components/common/page-header";
import CommonLayout from "~/layout/common-layout";
import { CreditCard, QrCode } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const Recharge: NextPageWithLayout = () => {
  return (
    <div className="px-8 mx-auto max-w-4xl my-16">
      <PageHeader className="my-16">Nạp tiền</PageHeader>
      <h2 className="text-xl font-medium text-primary mb-6">Phương thức nạp tiền</h2>

      <div className="flex items-center space-x-4 mb-6">
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[260px] w-full">
          <h3>Chuyển khoản ngân hàng</h3>

          <div className="flex items-center justify-between">
            <Badge className="bg-green-500 text-white hover:bg-green-600 cursor-default">Khuyến nghị</Badge>
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[260px] w-full">
          <h3>Thanh toán qua Momo</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phí 1.000đ</span>
            <Image src={"/momo.svg"} width={24} height={24} className="w-6 h-6  aspect-square rounded-sm object-contain" alt="momo" unoptimized />
          </div>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[260px] w-full">
          <h3>Thanh toán bằng mã QR</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phí 2.000đ</span>
            <QrCode className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-medium text-primary mb-1">Số tiền</h2>
      <p className="text-muted-foreground mb-6">Chọn mức tiền cần nạp ngay bên dưới</p>
      <div className="flex items-center space-x-4 my-6">
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full">
          <h3 className="text-center font-medium">20.000 đ</h3>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full">
          <h3 className="text-center font-medium">50.000 đ</h3>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full">
          <h3 className="text-center font-medium">100.000 đ</h3>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full">
          <h3 className="text-center font-medium">200.000 đ</h3>
        </div>
        <div className="p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full">
          <h3 className="text-center font-medium">500.000 đ</h3>
        </div>
      </div>
      <div className="mb-16">
        <p className="text-muted-foreground mb-6">Hoặc nhập số tiền tùy ý</p>
        <Input type="number" className="text-center text-base max-w-[200px] h-14 border-2 appearance-none font-medium" placeholder="Số tiền cần nạp" />
      </div>

      <div className="flex justify-end mt-auto">
        <Button size="lg" className="text-base h-12 w-36">
          Nạp tiền
        </Button>
      </div>
    </div>
  );
};

Recharge.getLayout = function getLayout(page) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Recharge;
