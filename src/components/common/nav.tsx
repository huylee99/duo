import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Bell, Loader2, Moon, Sun } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import UserMenu from "./user-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { pusherClient } from "~/lib/pusher-client";
import { api } from "~/server/utils/api";
import useToggle from "~/hooks/use-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Image from "next/image";
import generateNotificationMessage from "~/utils/generate-notification-message";
import formatRelativeTime from "~/utils/format-relative-time";

const navigation = [
  { name: "Trang chủ", href: "/" },
  { name: "Khám phá", href: "/explore" },
];

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  const handleChangeTheme = () => {
    if (activeTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="w-8 h-8 hover:bg-muted rounded-full flex justify-center items-center transition-[background-color] cursor-pointer" onClick={handleChangeTheme}>
      {activeTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </div>
  );
};

const Notifications = () => {
  const utils = api.useContext();
  const { onClose, value, onChange } = useToggle({ initialValue: false });
  const { data, isLoading } = api.notification.getNotifications.useQuery(undefined, { enabled: value === true });
  const { data: notificationCount } = api.notification.countUnreadNotifications.useQuery(undefined);

  const { mutate } = api.notification.markAsSeen.useMutation({
    onSuccess: () => {
      utils.notification.countUnreadNotifications.setData(undefined, () => ({ count: 0 }));
    },
  });

  const { mutate: markAsClicked } = api.notification.markAsClicked.useMutation({
    onSuccess: ({ id }) => {
      utils.notification.getNotifications.setData(undefined, oldData => {
        return oldData?.map(notification => {
          if (notification.id === id) {
            return {
              ...notification,
              clicked: true,
            };
          }

          return notification;
        });
      });
    },
  });

  return (
    <>
      <Popover onOpenChange={onChange} open={value}>
        <PopoverTrigger asChild>
          <div
            className="w-8 h-8 hover:bg-muted rounded-full flex justify-center items-center transition-[background-color] cursor-pointer relative"
            onClick={() => {
              if (notificationCount && notificationCount.count > 0) {
                mutate();
              }
            }}
          >
            <Bell className="w-5 h-5" />
            {notificationCount && notificationCount.count > 0 && <div className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></div>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-96 mr-2 p-2">
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {data &&
            data.length > 0 &&
            data.map(notification => (
              <Link
                href={"/"}
                key={notification.id}
                onClick={() => {
                  if (!notification.clicked) {
                    markAsClicked({
                      id: notification.id,
                    });
                  }
                }}
              >
                <div className={cn("flex cursor-pointer items-center rounded-md p-2 hover:bg-secondary", notification.seen && "text-muted-foreground")}>
                  <Image src={notification.sender!.image} width={50} height={50} className="object-cover bg-secondary/50 h-12 w-12 mr-2 shrink-0 rounded-full aspect-square" alt={`${notification.sender!.name || notification.sender!.username}-avatar`} unoptimized />

                  <div className="space-y-1">
                    <p className="text-sm line-clamp-2">
                      <span className="">{generateNotificationMessage(notification)}</span>
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">{formatRelativeTime(notification.created_at)}</p>
                  </div>
                  <div className="ml-auto self-center">{!notification.clicked && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}</div>
                </div>
              </Link>
            ))}
        </PopoverContent>
      </Popover>
    </>
  );
};

const Nav = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data?.user.id) {
      pusherClient.signin();
      const channel = pusherClient.subscribe(session.data?.user.id);

      pusherClient.bind("notification", (data: any) => {
        console.log(data);
      });
    }
  }, [session.data?.user.id]);

  return (
    <header className="h-[60px] bg-primary-foreground/80 backdrop-blur-sm sticky top-0 border-b border-border z-10 shadow-sm px-8">
      <div className="h-full flex items-center">
        <Link href="/" className="flex-1">
          <span className="text-2xl font-bold text-primary">Chưa biết</span>
        </Link>
        <nav className="flex-1">
          <ul className="flex items-center space-x-6 font-medium text-sm justify-center">
            {navigation.map((item, index) => (
              <li key={index} className="group">
                <Link href={item.href} className={cn("text-muted-foreground group-hover:text-primary transition-colors", router.pathname.startsWith(item.href) && "text-primary")}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 flex justify-end items-center space-x-4">
          <ThemeToggle />
          {session.status === "loading" && (
            <>
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
            </>
          )}
          {session.status === "authenticated" && (
            <>
              <Notifications />
              <UserMenu />
            </>
          )}
          {session.status === "unauthenticated" && (
            <Button size={"sm"} asChild>
              <Link href={"/login"}>Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
