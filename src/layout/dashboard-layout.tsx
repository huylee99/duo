import { PropsWithChildren } from "react";
import FlexLayout, { type LINKS } from "./flex-layout";
import { Home, LineChart, Award, Gamepad2, Banknote, Heart, Swords } from "lucide-react";

const links: LINKS = [
  {
    id: 1,
    categoryName: "Quản lý",
    links: [
      {
        id: "1-1",
        url: "/dashboard",
        name: "Trang chủ",
        icon: <Home className="mr-2 h-4 w-4" />,
      },
      {
        id: "1-2",
        url: "/dashboard/achievements",
        name: "Thành tích",
        icon: <Award className="mr-2 h-4 w-4" />,
      },
      {
        id: "1-3",
        url: "/dashboard/services",
        name: "Dịch vụ",
        icon: <Swords className="mr-2 h-4 w-4" />,
      },
    ],
  },
  {
    id: 2,
    categoryName: "Thống kê",
    links: [
      {
        id: "2-1",
        url: "/dashboard/income",
        name: "Doanh thu",
        icon: <LineChart className="mr-2 h-4 w-4" />,
      },
      {
        id: "2-2",
        url: "/dashboard/followers",
        name: "Người theo dõi",
        icon: <Heart className="mr-2 h-4 w-4" />,
      },
    ],
  },
  {
    id: 3,
    categoryName: "Lịch sử",
    links: [
      {
        id: "3-1",
        url: "/dashboard/duo-history",
        name: "Lịch sử duo",
        icon: <Gamepad2 className="mr-2 h-4 w-4" />,
      },
      {
        id: "3-2",
        url: "/dashboard/donation-history",
        name: "Lịch sử nhận donate",
        icon: <Banknote className="mr-2 h-4 w-4" />,
      },
    ],
  },
];

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <FlexLayout links={links}>{children}</FlexLayout>;
};

export default DashboardLayout;
