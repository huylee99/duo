import { NextPageWithLayout } from "../_app";
import CommonLayout from "~/layout/common-layout";
import { useRouter } from "next/router";
import PageHeader from "~/components/common/page-header";
import { Button } from "~/components/ui/button";
import { formatPrice } from "~/utils/format-price";
import { formatUnit } from "~/utils/format-unit";
import { formatPaymentStatus } from "~/utils/format-payment-status";
import { formatOrderStatus } from "~/utils/format-order-status";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";
import { api } from "~/server/utils/api";
import { useSession } from "next-auth/react";

const Duo: NextPageWithLayout = () => {
  const router = useRouter();
  const session = useSession();

  const { isLoading, data } = api.order.getOrderById.useQuery({ id: router.query.id as string }, { enabled: !!router.query.id });

  return (
    <div className="container my-16">
      <PageHeader className="my-16">Chi tiết yêu cầu</PageHeader>
      {!isLoading && data && (
        <div className="mt-16 grid grid-cols-5 gap-6">
          <div className="col-span-3 space-y-6">
            <div className="bg-primary-foreground p-6 rounded-lg shadow-md flex items-center justify-between">
              <h2 className="text-xl font-medium text-primary">Trạng thái duo</h2>
              <span className="text-pink-500 text-xl font-medium">{formatOrderStatus(data.order_status)}</span>
            </div>
            <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-medium text-primary mb-4">Thông tin duo</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Player</h4>
                  <p className="text-primary font-medium">{data.partner.name ?? data.partner.username}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Khách</h4>
                  <p className="text-primary font-medium">{data.user.name ?? data.user.username}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Dịch vụ</h4>
                  <p className="text-primary font-medium">{data.service.service_name}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Giá tiền</h4>
                  <p className="text-primary font-medium">
                    {formatPrice(data.service.service_price)} / {formatUnit(data.service.unit)}
                  </p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Số {formatUnit(data.service.unit)} thuê</h4>
                  <p className="text-primary font-medium">{data.total_service_requested}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-muted-foreground mb-1">Tình trạng thanh toán</h4>
                  <Badge variant={"secondary"}>{formatPaymentStatus(data.payment_status)}</Badge>
                </div>
                {data.service.unit === "time" && (
                  <>
                    <div className="col-span-1">
                      <h4 className="text-muted-foreground mb-1">Thời gian bắt đầu</h4>
                      <p className="text-primary font-medium">04-07-2023 11:05 PM</p>
                    </div>
                    <div className="col-span-1">
                      <h4 className="text-muted-foreground mb-1">Thời gian kết thúc</h4>
                      <p className="text-primary font-medium">05-07-2023 1:05 AM</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-medium text-primary mb-4">Thao tác</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="max-w-lg">
                    <p className="text-primary">Hủy duo và hoàn tiền</p>
                    <p className="text-muted-foreground text-sm">Chỉ được hủy khi yêu cầu đang được chờ duyệt hoặc trong vòng 5 phút sau khi yêu cầu được chấp nhận</p>
                  </div>

                  <Button size={"lg"} className="bg-secondary text-red-600 hover:bg-red-600 hover:text-white shadow-sm">
                    Hủy duo
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="max-w-lg">
                    <p className="text-primary">Báo cáo</p>
                    <p className="text-muted-foreground text-sm">Báo cáo khi khách hoặc player có hành vi không đúng mực.</p>
                  </div>

                  <Button size={"lg"} className="bg-secondary text-red-600 hover:bg-red-600 hover:text-white shadow-sm">
                    Báo cáo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-6">
            <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
              {data.service.unit === "time" && (
                <>
                  <h2 className="text-xl font-medium mb-4 text-primary">Thời gian</h2>
                  <p className="text-6xl font-semibold text-pink-600 mb-4">0{data.total_service_requested}:00:00</p>
                </>
              )}
              {data.service.unit === "game" && (
                <>
                  <h2 className="text-xl font-medium mb-4 text-primary">Số game</h2>
                  <p className="text-6xl font-semibold text-pink-600 mb-4">{data.total_service_requested}</p>
                </>
              )}

              {data.partner_id === session.data?.user.id! && data.order_status === "pending" && (
                <div className="flex items-center space-x-2">
                  <Button className="bg-pink-600 text-white hover:bg-pink-700">Chấp nhận</Button>
                  <Button variant={"secondary"}>Từ chối</Button>
                </div>
              )}

              {data.order_status === "accepted" && <Button className="bg-pink-600 text-white hover:bg-pink-700">Hoàn thành duo</Button>}
            </div>
            <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-medium text-primary mb-6">Hoạt động</h2>
              <ol className="relative border-l border-l-border ml-6">
                <li className="mb-8 ml-12">
                  <time className="absolute -left-6 text-sm text-muted-foreground bg-primary-foreground py-2">1:05 AM</time>
                  <div className="flex items-center">
                    <Image src={"/avatar.jpg"} width={32} height={32} className="w-8 h-8 aspect-square rounded-full mr-4" alt="avatar" />
                    <div className="space-y-1">
                      <p>
                        𝒱𝒶𝓃𝒽 ☁️ <span className="text-muted-foreground">đã kết thúc yêu cầu duo.</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li className="ml-12">
                  <time className="absolute -left-6 text-sm text-muted-foreground bg-primary-foreground py-2">11:05 PM</time>
                  <div className="flex items-center">
                    <Image src={"/avatar.jpg"} width={32} height={32} className="w-8 h-8 aspect-square rounded-full mr-4" alt="avatar" />
                    <div className="space-y-1">
                      <p>
                        𝒱𝒶𝓃𝒽 ☁️ <span className="text-muted-foreground">đã chấp nhận yêu cầu duo.</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Duo.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Duo;
