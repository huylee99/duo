import { User, ImageIcon, Lock, MailCheck, HelpCircle } from "lucide-react";
import FlexLayout from "./flex-layout";
import { type PropsWithChildren } from "react";
import type { LINKS } from "./flex-layout";

const LINKS: LINKS = [
  {
    id: 1,
    categoryName: "Cài đặt",
    links: [
      {
        id: "1-1",
        url: "/settings/profile",
        name: "Thông tin cá nhân",
        icon: () => <User className="mr-2 h-4 w-4" />,
      },
      {
        id: "1-2",
        url: "/settings/images",
        name: "Hình ảnh",
        icon: () => <ImageIcon className="mr-2 h-4 w-4" />,
        role: ["user"],
      },
    ],
  },
];

const SettingsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return <FlexLayout links={LINKS}>{children}</FlexLayout>;
};

export default SettingsLayout;
