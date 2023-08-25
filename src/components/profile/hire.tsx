import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import useToggle from "~/hooks/use-toggle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { api } from "~/server/utils/api";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { formatPrice } from "~/utils/format-price";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

type HireProps = {
  userId: string;
};

type OrderData = {
  service_id: string;
  partner_id: string;
  amount: number;
  price: number;
  discount_id?: string;
};

const Hire: React.FC<HireProps> = ({ userId }) => {
  const router = useRouter();
  const defaultValues: OrderData = { service_id: "", partner_id: userId, amount: 0, price: 0 };
  const [orderData, setOrderData] = useState<OrderData>(defaultValues);
  const { onChange: onOpenSideBarChange, value: isSideBarOpen, onClose } = useToggle();
  const { data, isLoading } = api.service.getServicesByUserId.useQuery({ user_id: userId }, { enabled: isSideBarOpen });
  const { data: balanceData, isLoading: isBalanceLoading } = api.wallet.getBalance.useQuery(undefined, { enabled: isSideBarOpen, refetchOnWindowFocus: true });
  const { mutate, isLoading: isMutationLoading } = api.order.create.useMutation({
    onSuccess: ({ id }) => {
      toast.success("Đã gửi yêu cầu thuê người chơi thành công. Vui lòng chờ người chơi phản hồi.");
      setOrderData(defaultValues);
      onClose();

      router.push(`/duo/${id}`);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const selectedService = data?.find(service => service.id === orderData.service_id);

  const isEligibleToHire = selectedService && orderData.amount > 0 && balanceData && balanceData.balance >= orderData.price && orderData.service_id !== "";

  const handleHire = () => {
    if (!isEligibleToHire) {
      return;
    }

    mutate({
      partner_id: orderData.partner_id,
      service_id: orderData.service_id,
      total_amount: orderData.price,
      total_service_requested: orderData.amount,
    });
  };

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

              {selectedService && orderData.amount > 0 && (
                <>
                  <div className="my-2 w-full border-t border-t-muted"></div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Giá tiền</span>
                      <span className="text-primary font-medium text-lg">{formatPrice(orderData.price)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Số tiền cần thanh toán</span>
                      <span className="text-primary font-medium text-lg">{formatPrice(orderData.price)}</span>
                    </div>
                    {!isBalanceLoading && balanceData && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Số dư trong ví</span>
                          <span className="text-primary font-medium text-lg">{formatPrice(balanceData.balance)}</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <Link target="_blank" href={"/wallet/recharge"}>
                            <Button size="sm">Nạp thêm</Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="my-2 w-full border-t border-t-muted"></div>
                  <Button onClick={handleHire} disabled={!isEligibleToHire || isMutationLoading} className="w-full text-base bg-pink-800 hover:bg-pink-900 text-white" size="lg">
                    {isMutationLoading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
                    Thuê
                  </Button>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Hire;
