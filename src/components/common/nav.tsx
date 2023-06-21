import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import UserMenu from "./user-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

const Nav = () => {
  const router = useRouter();
  const session = useSession();

  return (
    <header className="h-[60px] bg-background/90 backdrop-blur-sm sticky top-0 border-b border-border">
      <div className="container h-full flex items-center">
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
          {session.status === "authenticated" && (
            <>
              <div className="w-8 h-8 hover:bg-muted rounded-full flex justify-center items-center transition-[background-color] cursor-pointer">
                <Bell className="w-5 h-5" />
              </div>
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
