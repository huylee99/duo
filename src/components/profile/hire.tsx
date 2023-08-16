import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import useToggle from "~/hooks/use-toggle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, ChevronsUpDown, Check } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api } from "~/server/utils/api";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { RouterOutputs } from "~/server/utils/api";
import { cn } from "~/lib/utils";
import { formatPrice } from "~/utils/format-price";
import { Input } from "../ui/input";

type HireProps = {
  userId: string;
};

type Service = RouterOutputs["service"]["getServicesByUserId"][number];

type OrderData = {
  service_id: string;
  partner_id: string;
  amount: number;
  price: number;
  discount_id?: string;
};

const Hire: React.FC<HireProps> = ({ userId }) => {
  const [orderData, setOrderData] = useState<OrderData>({ service_id: "", partner_id: userId, amount: 0, price: 0 });
  const { onChange: onOpenSideBarChange, value: isSideBarOpen } = useToggle();
  const { data, isLoading } = api.service.getServicesByUserId.useQuery({ user_id: userId }, { enabled: isSideBarOpen });

  const selectedService = data?.find(service => service.id === orderData.service_id);

  console.log(orderData);

  return (
    <>
      <Sheet open={isSideBarOpen} onOpenChange={onOpenSideBarChange}>
        <SheetTrigger asChild>
          <button type="button" className="w-40 text-base rounded-lg bg-pink-700 text-white h-11 font-bold hover:bg-pink-800 transition-[background-color]">
            Thuê
          </button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xl w-full">
          <SheetHeader>
            <SheetTitle className="text-3xl font-bold">Thuê người chơi</SheetTitle>
            <SheetDescription>Bạn có thể thuê người chơi để chơi cùng hoặc hướng dẫn bạn chơi game.</SheetDescription>
            <Alert className="text-yellow-500 border-yellow-500 !my-6">
              <AlertCircle className="h-4 w-4 !text-yellow-500" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>Người chơi này hiện tại đang bận hoặc vắng mặt, có thể bạn sẽ không nhận được phản hồi từ người chơi. Để chắc chắn hơn, vui lòng nhắn tin thông báo cho người chơi trước khi thuê.</AlertDescription>
            </Alert>
          </SheetHeader>

          {!isLoading && data && data.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label className="text-base">Chọn dịch vụ</Label>
                <Select
                  onValueChange={value => {
                    setOrderData(prev => ({ ...prev, service_id: value }));
                  }}
                  value={orderData.service_id === "" ? undefined : orderData.service_id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {`${service.service_name} - ${formatPrice(service.service_price)}/${service.unit === "game" ? "game" : "giờ"}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedService && (
                <div className="space-y-2">
                  <Label className="text-base">Chọn số {selectedService.unit === "game" ? "game" : "giờ"} chơi</Label>
                  <Select
                    onValueChange={value => {
                      const amount = Number.parseInt(value);
                      const price = amount * selectedService.service_price;

                      setOrderData(prev => ({ ...prev, amount, price }));
                    }}
                    value={orderData.amount === 0 ? undefined : String(orderData.amount)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedService.unit === "game" ? "Số game" : "Số giờ"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService?.unit === "game"
                        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(game => (
                            <SelectItem key={game} value={String(game)}>
                              {game}
                            </SelectItem>
                          ))
                        : [1, 2, 3, 4].map(hour => (
                            <SelectItem key={hour} value={String(hour)}>
                              {hour}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="my-2 w-full border-t border-t-muted"></div>
              {selectedService && orderData.amount > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Giá tiền</span>
                    <span className="text-primary font-medium text-lg">{formatPrice(orderData.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mã giảm giá</span>
                    <div className="text-right space-x-2 flex items-center">
                      <Input className="max-w-[128px] h-10 uppercase" />
                      <Button size={"sm"}>Áp dụng</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Số tiền cần thanh toán</span>
                    <span className="text-primary font-medium text-lg">{formatPrice(orderData.price)}</span>
                  </div>
                </div>
              )}
              <div className="my-2 w-full border-t border-t-muted"></div>
              <Button className="w-full text-lg bg-pink-800 hover:bg-pink-900 text-white" size="lg">
                Thanh toán
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Hire;
