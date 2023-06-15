import Link from "next/link";
import RegisterForm from "~/components/auth/register-form";
import { NextPageWithLayout } from "./_app";
import AuthLayout from "~/layout/auth-layout";

const Register: NextPageWithLayout = function () {
  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đăng ký</h1>
          <p className="text-sm text-muted-foreground">Vui lòng nhập email và mật khẩu để đăng ký</p>
        </div>
        <RegisterForm />
      </div>
    </>
  );
};

Register.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Register;
