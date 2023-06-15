import * as React from "react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <Button variant="outline" type="button" disabled={isLoading !== undefined} onClick={loginWithGoogle}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image alt="google-logo" src={"google.svg"} width={16} height={16} className="mr-2 object-contain" />} Đăng nhập với Google
      </Button>
    </>
  );
}
