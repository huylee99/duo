import * as React from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<"google" | "credentials">();

  const loginWithGoogle = async () => {
    setIsLoading("google");
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2 space-y-2">
        <form className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Địa chỉ email" disabled={isLoading !== undefined} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" type="password" placeholder="•••••••••••" disabled={isLoading !== undefined} />
          </div>
        </form>
        <Button disabled={isLoading !== undefined}>
          {isLoading === "credentials" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Đăng nhập
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading !== undefined} onClick={loginWithGoogle}>
        {isLoading === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image alt="google-logo" src={"google.svg"} width={16} height={16} className="mr-2 object-contain" />} Đăng nhập với Google
      </Button>
    </div>
  );
}
