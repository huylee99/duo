import Image from "next/image";
import Link from "next/link";
import { Command, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { useState } from "react";

export default function AuthLayout(props: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState<"google">();

  const loginWithGoogle = async () => {
    setIsLoading("google");
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link href="/register" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "absolute right-4 top-4 md:right-8 md:top-8")}>
          Đăng ký
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
            }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" onClick={() => signIn()} /> Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before. Highly recommended!&rdquo;</p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="grid gap-2 space-y-2">{props.children}</div>
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
              </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading !== undefined} onClick={loginWithGoogle}>
              {isLoading === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image alt="google-logo" src={"google.svg"} width={16} height={16} className="mr-2 object-contain" />} Đăng nhập với Google
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
}
