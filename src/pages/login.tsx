import Link from "next/link";
import { UserAuthForm } from "~/components/auth/user-auth-form";
import { NextPageWithLayout } from "./_app";
import AuthLayout from "~/layout/auth-layout";

const LoginPage: NextPageWithLayout = function () {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="text-sm text-muted-foreground">Vui lòng nhập email và mật khẩu để đăng nhập</p>
        </div>
        <UserAuthForm />
      </div>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default LoginPage;
