import { NextPageWithLayout } from "~/pages/_app";
import PageHeader from "~/components/common/page-header";
import CommonLayout from "~/layout/common-layout";
import { CreditCard, QrCode } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/utils/format-price";

const AMOUNTS = [20000, 50000, 100000, 200000, 500000];

const Recharge: NextPageWithLayout = () => {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "momo" | "qrcode">();
  const [amount, setAmount] = useState<number>();
  const [customAmount, setCustomAmount] = useState<number>();
  const [priceType, setPriceType] = useState<"custom" | "preset">();

  return (
    <div className="px-8 mx-auto max-w-4xl my-16">
      <PageHeader className="my-16">Nạp tiền</PageHeader>
      <h2 className="text-xl font-medium text-primary mb-6">Phương thức nạp tiền</h2>

      <div className="flex items-center space-x-4 mb-6">
        <div className={cn("p-4 rounded-md flex flex-col border-2 border-border space-y-8 cursor-pointer max-w-[260px] w-full", paymentMethod === "bank" && "border-pink-500")} onClick={() => setPaymentMethod("bank")}>
          <h3>Chuyển khoản ngân hàng</h3>

          <div className="flex items-center justify-between">
            <Badge className="bg-green-500 text-white hover:bg-green-600 cursor-default">Khuyến nghị</Badge>
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className={cn("p-4 rounded-md flex flex-col border-2 border-border space-y-8 cursor-pointer max-w-[260px] w-full", paymentMethod === "momo" && "border-pink-500")} onClick={() => setPaymentMethod("momo")}>
          <h3>Thanh toán qua Momo</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phí 1.000đ</span>
            <Image src={"/momo.svg"} width={24} height={24} className="w-6 h-6  aspect-square rounded-sm object-contain" alt="momo" unoptimized />
          </div>
        </div>
        <div className={cn("p-4 rounded-md flex flex-col border-2 border-border space-y-8 cursor-pointer max-w-[260px] w-full", paymentMethod === "qrcode" && "border-pink-500")} onClick={() => setPaymentMethod("qrcode")}>
          <h3>Thanh toán bằng mã QR</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phí 2.000đ</span>
            <QrCode className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-medium text-primary mb-1">Số tiền</h2>
      <p className="text-muted-foreground mb-4">Chọn mức tiền cần nạp ngay bên dưới</p>
      <div className="flex items-center space-x-4 mb-4">
        {AMOUNTS.map(value => (
          <div
            key={value}
            onClick={() => {
              if (priceType !== "preset") {
                setPriceType("preset");
              }
              setAmount(value);
            }}
            className={cn("p-4 rounded-md flex flex-col border-2 border-border space-y-8 max-w-[160px] w-full cursor-pointer", value === amount && priceType === "preset" && "border-pink-500")}
          >
            <h3 className="text-center font-medium">{formatPrice(value)}</h3>
          </div>
        ))}
      </div>
      <div className="mb-16">
        <p className="text-muted-foreground mb-4">Hoặc nhập số tiền tùy ý</p>
        <Input
          onClick={() => {
            setPriceType("custom");
          }}
          type="number"
          value={customAmount}
          onChange={event => setCustomAmount(Number.parseInt(event.target.value))}
          className={cn("text-center text-base max-w-[200px] h-14 border-2 appearance-none font-medium", priceType === "custom" && "border-pink-500")}
          placeholder="Số tiền cần nạp"
        />
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
