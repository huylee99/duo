import * as React from "react";
import { Button } from "~/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { api } from "~/server/utils/api";
import { authSchema, type AuthFields } from "~/shared/validators/auth-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const Register = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<AuthFields>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { mutate, isLoading } = api.user.createUser.useMutation({
    onSuccess: () => {
      toast.success("Tạo tài khoản thành công");
      reset();
      void router.push("/login");
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit(data => {
    mutate({
      email: data.email,
      password: data.password,
    });
  });

  return (
    <>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <Label htmlFor="username">Email</Label>
          <Input disabled={isLoading} {...register("email")} autoComplete="off" aria-autocomplete="none" placeholder="abc@gmail.com" className="mt-2" />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input disabled={isLoading} autoComplete="off" aria-autocomplete="none" {...register("password")} type="password" placeholder="••••••••" className="mt-2 focus-visible:border-border" />
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tạo tài khoản
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Bạn đã có tài khoản?{" "}
          <Link href={"/login"} className="font-medium text-primary hover:underline hover:underline-offset-2">
            Đăng nhập
          </Link>
        </p>
      </form>
    </>
  );
};

export default Register;
