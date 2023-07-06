import PageHeader from "~/components/common/page-header";
import CommonLayout from "~/layout/common-layout";
import DashboardLayout from "~/layout/dashboard-layout";
import { NextPageWithLayout } from "../_app";
import FollowerList from "~/components/dashboard/follower-list";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useRouter } from "next/router";

const Followers: NextPageWithLayout = () => {
  const router = useRouter();

  const tab = router.query.tab as string | undefined;

  return (
    <div>
      <PageHeader className="mb-4 lg:mb-8">Người theo dõi</PageHeader>
      <div className="flex items-center pb-1 mt-1 mb-8">
        <Link
          href={{
            pathname: "/dashboard/followers",
            query: {
              tab: "followers",
            },
          }}
          className={cn("h-12 relative px-4 hover:bg-secondary transition-[background-color] rounded-md flex items-center justify-center text-center font-medium", (tab === undefined || tab === "followers") && "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 text-pink-600 after:bg-pink-600 after:rounded-t-full hover:bg-transparent")}
        >
          Người theo dõi
        </Link>
        <Link
          href={{
            pathname: "/dashboard/followers",
            query: {
              tab: "following",
            },
          }}
          className={cn("h-12 relative px-4 hover:bg-secondary flex items-center transition-[background-color] rounded-md justify-center text-center font-medium", tab === "following" && "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-1 text-pink-600 after:bg-pink-600 after:rounded-t-full hover:bg-transparent")}
        >
          Đang theo dõi
        </Link>
      </div>
      <FollowerList />
    </div>
  );
};

Followers.getLayout = (page: React.ReactElement) => {
  return (
    <CommonLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </CommonLayout>
  );
};

export default Followers;
