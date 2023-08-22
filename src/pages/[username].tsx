import { NextPageWithLayout } from "./_app";
import CommonLayout from "~/layout/common-layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { StarIcon } from "lucide-react";
import Hire from "~/components/profile/hire";
import { api } from "~/server/utils/api";
import { formatPrice } from "~/utils/format-price";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const { username, tab } = router.query;

  const { isLoading, data } = api.user.getUserByUsername.useQuery(
    { username: username as string },
    {
      enabled: username !== undefined,
    }
  );

  return (
    <div className="container mb-16">
      {!isLoading && data && (
        <div className="flex flex-col space-y-4">
          <div>
            <div className="relative">
              <Image src={"/banner.jpg"} className="h-[380px] object-cover" width={1336} height={380} alt="banner" unoptimized />
              <div className="absolute bottom-0 right-0 flex space-x-4 justify-between items-center px-8 py-4">
                {data.facebook && (
                  <a href={data.facebook} target="_blank">
                    <Image src={"/facebook.svg"} alt="facebook" unoptimized width={24} height={24} className="w-6 h-6" />
                  </a>
                )}

                {data.discord && (
                  <a href={data.discord} target="_blank">
                    <Image src={"/discord.svg"} alt="discord" unoptimized width={24} height={24} className="w-6 h-6" />
                  </a>
                )}

                {data.instagram && (
                  <a href={data.instagram} target="_blank">
                    <Image src={"/instagram.svg"} alt="instagram" unoptimized width={24} height={24} className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-primary-foreground px-8 rounded-b-lg shadow-sm">
              <div className="relative flex gap-4 border-b border-b-border">
                <div className="relative w-[184px] h-[184px] bg-secondary rounded-full -top-6 border-4 border-primary-foreground flex-shrink-0">
                  <Image src={data.image} alt="avatar" className="aspect-square object-cover rounded-full" fill unoptimized />
                  <div className="w-8 h-8 rounded-full bg-green-500 absolute bottom-2 right-2 border-4 border-primary-foreground"></div>
                </div>
                <div className="py-8 flex justify-between w-full">
                  <div className="gap-2 flex flex-col items-start flex-2">
                    <h2 className="text-3xl font-extrabold">{data.name ?? data.username}</h2>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(item => (
                        <Image key={item} src={`/badge-${item}.png`} width={28} height={28} className="aspect-square w-7 h-7 object-contain" alt="badge" unoptimized />
                      ))}
                    </div>
                    {data.shortBio && <div className="mt-auto font-medium">{data.shortBio}</div>}
                  </div>
                  <div className="flex flex-col justify-end gap-2">{!isLoading && data && <Hire userId={data.id} />}</div>
                </div>
              </div>
              <div className="flex items-center pb-1 mt-1">
                <Link
                  href={{
                    pathname: `/${data.username}`,
                    query: {
                      tab: "about",
                    },
                  }}
                  className={cn("h-12 relative px-4 hover:bg-secondary transition-[background-color] rounded-md flex items-center justify-center text-center font-medium", (tab === undefined || tab === "about") && "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 text-pink-600 after:bg-pink-600 after:rounded-t-full hover:bg-transparent")}
                >
                  Thông tin
                </Link>
                <Link
                  href={{
                    pathname: `/${data.username}`,
                    query: {
                      tab: "feeds",
                    },
                  }}
                  className={cn("h-12 relative px-4 hover:bg-secondary flex items-center transition-[background-color] rounded-md justify-center text-center font-medium", tab === "feeds" && "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 text-pink-600 after:bg-pink-600 after:rounded-t-full hover:bg-transparent")}
                >
                  Feeds
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-primary-foreground rounded-lg p-5 grid grid-cols-3 divide-x-2 shadow-sm">
            <div className="col-span-1 text-center">
              <h2 className="font-extrabold text-pink-600 text-5xl mb-1">120</h2>
              <p className="text-primary text-xl font-semibold">Giờ được thuê</p>
            </div>
            <div className="col-span-1 text-center">
              <h2 className="font-extrabold text-pink-600 text-5xl mb-1">12k</h2>
              <p className="text-primary text-xl font-semibold">Người theo dõi</p>
            </div>
            <div className="col-span-1 text-center">
              <h2 className="font-extrabold text-pink-600 text-5xl mb-1">4.7</h2>
              <p className="text-primary text-xl font-semibold">Đánh giá</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 items-start">
            <div className="col-span-1 bg-primary-foreground rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-xl mb-5">Dịch vụ</h3>
              <div className="flex flex-col divide-y">
                {data.services.map(service => (
                  <div key={service.id} className="flex flex-col py-5 last:pb-0">
                    <h4 className="font-semibold mb-0.5">{service.service_name}</h4>
                    <p className="text-muted-foreground text-sm mb-3">{service.service_desc}</p>
                    <span className="text-lg font-bold leading-none">
                      {formatPrice(service.service_price)} <span className="text-muted-foreground font-normal text-sm">/{service.unit === "game" ? "game" : "giờ"}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="bg-primary-foreground rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-xl mb-10">Giới thiệu</h3>
                <div className="prose text-primary leading-relaxed">{data.longBio ? <div dangerouslySetInnerHTML={{ __html: data.longBio }} /> : <span className="text-muted-foreground">Chưa cập nhật</span>}</div>
              </div>
              <div className="bg-primary-foreground rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-xl">Đánh giá</h3>

                  <div className="flex items-center">
                    <StarIcon className="w-5 h-5 text-yellow-500 mr-2" fill="#eab308" />
                    <p className="font-semibold">
                      4.7 <span className="text-muted-foreground font-normal">(16 đánh giá)</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col divide-y">
                  {[1, 2, 3, 4, 5].map(item => (
                    <div key={item} className="flex items-start gap-5 py-5 last:pb-0">
                      <Image src={"/avatar.jpg"} className="aspect-square w-14 h-14 object-cover rounded-full" unoptimized width={56} height={56} alt="avatar" quality={100} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-lg">𝒱𝒶𝓃𝒽 ☁️</h4>
                          <span className="text-muted-foreground text-sm">2 giờ trước</span>
                        </div>

                        <div className="flex items-center space-x-1 mb-3">
                          {[1, 2, 3, 4, 5].map(item => (
                            <StarIcon key={item} className="w-4 h-4 text-yellow-500" fill="#eab308" />
                          ))}
                        </div>
                        <p className="text-muted-foreground">cute dang yeu choi game hay nch dth =)).</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Profile;
