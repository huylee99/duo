import { NextPageWithLayout } from "../_app";
import CommonLayout from "~/layout/common-layout";
import { useRouter } from "next/router";
import PageHeader from "~/components/common/page-header";
import { Button } from "~/components/ui/button";
import { formatPrice } from "~/utils/format-price";
import { Badge } from "~/components/ui/badge";
import Image from "next/image";

const Duo: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <div className="container my-16">
      <PageHeader className="my-16">Duo đang thực hiện</PageHeader>
      <div className="mt-16 grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-primary mb-4">Thông tin duo</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Partner</h4>
                <p className="text-primary font-medium">𝒱𝒶𝓃𝒽 ☁️</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Khách</h4>
                <p className="text-primary font-medium">Huy Le</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Dịch vụ</h4>
                <p className="text-primary font-medium">Chơi game</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Giá tiền</h4>
                <p className="text-primary font-medium">{formatPrice(50000)} / giờ</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Số giờ thuê</h4>
                <p className="text-primary font-medium">2 giờ</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Tình trạng thanh toán</h4>
                <Badge variant={"secondary"}>Đã thanh toán</Badge>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Thời gian bắt đầu</h4>
                <p className="text-primary font-medium">04-07-2023 11:05 PM</p>
              </div>
              <div className="col-span-1">
                <h4 className="text-muted-foreground mb-1">Thời gian kết thúc</h4>
                <p className="text-primary font-medium">05-07-2023 1:05 AM</p>
              </div>
            </div>
          </div>
          <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-medium text-primary">Thao tác</h2>
              <p className="text-muted-foreground text-sm">Lưu ý: Thao tác tại đây sẽ không thể hoàn lại</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-primary">Hủy duo và hoàn tiền abcxyz</p>
              <Button size={"lg"} className="bg-secondary text-red-600 hover:bg-red-600 hover:text-white shadow-sm">
                Hủy duo
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2 space-y-6">
          <div className="bg-primary-foreground p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-4 text-primary">Thời gian còn lại</h2>
            <p className="text-6xl font-semibold text-pink-600 mb-4">01:00:00</p>
            <Button className="bg-pink-600 text-white hover:bg-pink-700">Kết thúc duo</Button>
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
    </div>
  );
};

Duo.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Duo;
