import { LogOut, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { genImageUrl } from "~/utils/image-url";
import Link from "next/link";

function UserMenu() {
  const session = useSession();

  const avatar = session.data?.user.image!;
  const username = session.data?.user.username!;
  const name = session.data?.user.name!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image src={genImageUrl(avatar)} alt="avatar" width={32} height={32} className="object-cover rounded-full overflow-hidden w-8 h-8 aspect-square cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${username}`}>
              <User className="mr-2 h-4 w-4" />
              <span>Trang cá nhân</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirect: true })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
