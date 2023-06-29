import { NextPageWithLayout } from "./_app";
import CommonLayout from "~/layout/common-layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { StarIcon } from "lucide-react";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const { username, tab } = router.query;

  console.log(tab);

  return (
    <div className="container">
      <div className="flex flex-col space-y-4">
        <div>
          <div className="relative">
            <Image src={"/banner.jpg"} className="w-full h-[380px] object-cover" width={1336} height={380} alt="banner" quality={80} />
            <div className="absolute bottom-0 right-0 flex space-x-4 justify-between items-center px-8 py-4">
              <Image src={"/facebook.svg"} alt="facebook" unoptimized width={24} height={24} className="w-6 h-6" />
              <Image src={"/discord.svg"} alt="discord" unoptimized width={24} height={24} className="w-6 h-6" />
              <Image src={"/instagram.svg"} alt="instagram" unoptimized width={24} height={24} className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-primary-foreground px-8 rounded-b-lg">
            <div className="relative flex gap-4 border-b border-b-border">
              <div className="relative w-[184px] h-[184px] rounded-full -top-6 border-4 border-primary-foreground flex-shrink-0">
                <Image src={"/avatar.jpg"} alt="avatar" className="aspect-square object-cover rounded-full" fill quality={90} />
                <div className="w-8 h-8 rounded-full bg-green-500 absolute bottom-2 right-2 border-4 border-primary-foreground"></div>
              </div>
              <div className="py-8 flex justify-between w-full">
                <div className="gap-2 flex flex-col items-start flex-2">
                  <h2 className="text-3xl font-extrabold">𝒱𝒶𝓃𝒽 ☁️</h2>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(item => (
                      <Image key={item} src={`/badge-${item}.png`} width={28} height={28} className="aspect-square w-7 h-7 object-contain" alt="badge" unoptimized />
                    ))}
                  </div>
                  <div className="mt-auto font-medium">Đến và Lấy cắp trái tym em đi ♥</div>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <button type="button" className="w-40 text-base rounded-full bg-pink-700 text-white h-11 font-bold hover:bg-pink-800 transition-[background-color]">
                    Thuê
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center pb-1 mt-1">
              <Link
                href={{
                  pathname: "/abc",
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
                  pathname: "/abc",
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

        <div className="bg-primary-foreground rounded-lg p-5 grid grid-cols-3 divide-x-2">
          <div className="col-span-1 text-center">
            <h2 className="font-extrabold text-pink-600 text-5xl mb-1">120</h2>
            <p className="text-primary text-xl font-semibold">Số giờ được thuê</p>
          </div>
          <div className="col-span-1 text-center">
            <h2 className="font-extrabold text-pink-600 text-5xl mb-1">12k</h2>
            <p className="text-primary text-xl font-semibold">Số người theo dõi</p>
          </div>
          <div className="col-span-1 text-center">
            <h2 className="font-extrabold text-pink-600 text-5xl mb-1">4.7</h2>
            <p className="text-primary text-xl font-semibold">Đánh giá</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="col-span-1 bg-primary-foreground rounded-lg p-5">
            <h3 className="font-semibold text-xl mb-5">Dịch vụ</h3>
            <div className="flex flex-col divide-y">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="flex items-start gap-5 py-5 last:pb-0">
                  <Image src={"/controller.png"} width={64} height={64} className="w-16 h-16" alt="controller" quality={100} />
                  <div className="flex flex-col">
                    <h4 className="font-semibold mb-0.5">Chơi game</h4>
                    <p className="text-muted-foreground text-sm mb-3">Chơi tất cả game theo yêu cầu</p>
                    <span className="text-lg font-bold leading-none">
                      70.000đ <span className="text-muted-foreground font-normal text-sm">/giờ</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 space-y-4">
            <div className="bg-primary-foreground rounded-lg p-5">
              <h3 className="font-semibold text-xl mb-10">Giới thiệu</h3>
              <div className="prose leading-relaxed">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima ipsum accusantium vel.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus ducimus, ipsam repellendus error optio rem at quos nemo nisi atque dolor explicabo debitis perspiciatis eum quaerat neque magni, itaque quis. Velit doloribus numquam iusto cupiditate est quia temporibus dolore veritatis asperiores dicta optio necessitatibus perspiciatis laudantium voluptate voluptatum, ipsa rerum totam praesentium ipsum perferendis. Unde qui similique facilis, placeat cum laudantium pariatur nihil vitae, eaque labore dolores expedita dolorum!</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores quibusdam laborum sequi corrupti aut aliquid, sint error optio! A, corrupti vel nihil natus quaerat magnam unde sequi voluptatem iste minus? Molestias, quam sit.</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, dicta id!</p>
              </div>
            </div>
            <div className="bg-primary-foreground rounded-lg p-5">
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
                    <Image src={"/avatar.jpg"} className="aspect-square w-14 h-14 object-cover rounded-full" width={56} height={56} alt="avatar" quality={100} />
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
    </div>
  );
};

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <CommonLayout>{page}</CommonLayout>;
};

export default Profile;
