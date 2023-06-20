import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { emailValidator, type Email } from "~/shared/validators/email-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const LoginPage = function () {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Email>({ resolver: zodResolver(emailValidator) });
  const [isLoading, setIsLoading] = useState<"google" | "discord" | "email">();

  const loginWithGoogle = async () => {
    setIsLoading("google");
    const result = await signIn("google", { callbackUrl: "/" });

    if (result?.error) {
      setIsLoading(undefined);
    }
  };

  const loginWithEmail = handleSubmit(async data => {
    setIsLoading("email");
    const result = await signIn("email", { email: data.email, callbackUrl: "/admin", redirect: false });
    setIsLoading(undefined);
    if (result?.error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.");
      return;
    }

    reset();
    toast.success("Vui lòng kiểm tra email để đăng nhập.");
  });

  const loginWithDiscord = async () => {
    setIsLoading("discord");
    const result = await signIn("discord", { callbackUrl: "/" });
    if (result?.error) {
      setIsLoading(undefined);
    }
  };

  return (
    <div className="container relative h-screen flex flex-col items-center justify-center lg:max-w-none lg:px-0">
      <div className="space-y-6 flex flex-col items-center sm:w-[350px] h-fit w-fit mx-auto">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Tạo tài khoản và đăng nhập</h1>
          <p className="text-sm text-muted-foreground">Vui lòng nhập Email vào bên dưới để đăng nhập</p>
        </div>
        <form className="w-full" onSubmit={loginWithEmail}>
          <div className="grid gap-2 w-full">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input {...register("email")} placeholder="abcd@example.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" disabled={isLoading !== undefined} />
              {errors.email && <span className="text-xs text-red-500">Email không hợp lệ</span>}
            </div>
            <Button type="submit" disabled={isLoading !== undefined}>
              {isLoading === "email" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập với Email
            </Button>
          </div>
        </form>
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
          </div>
        </div>
        <div className="space-y-3">
          <Button variant="outline" type="button" disabled={isLoading !== undefined} onClick={loginWithGoogle} className="w-full">
            {isLoading === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image alt="google-logo" src={"google.svg"} width={20} height={20} className="mr-2 object-contain" />} Đăng nhập với Google
          </Button>
          <Button variant="outline" type="button" disabled={isLoading !== undefined} onClick={loginWithDiscord} className="w-full">
            {isLoading === "discord" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image alt="discord-logo" src={"discord.svg"} width={20} height={20} className="mr-2 object-contain" />} Đăng nhập với Discord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
