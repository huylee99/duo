import * as React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { type AuthFields, authSchema } from "~/shared/validators/auth-validator";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthFields>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = handleSubmit(async data => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }
  });

  return (
    <>
      <form className="space-y-4" onSubmit={login}>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} type="email" placeholder="Địa chỉ email" disabled={isLoading} />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" {...register("password")} type="password" placeholder="•••••••••••" disabled={isLoading} />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </>
  );
}
