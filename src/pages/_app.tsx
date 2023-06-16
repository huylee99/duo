import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { type NextPage } from "next";
import { api } from "~/server/utils/api";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect, type ReactElement, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: Session;
};

const App = ({ Component, pageProps, session }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(
    <>
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <Component {...pageProps} />
      </SessionProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "font-medium text-sm shadow-md",
          duration: 4000,
          style: {
            color: "black",
          },
        }}
      />
    </>
  );
};

export default api.withTRPC(App);
