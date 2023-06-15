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
      <SessionProvider session={session}>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
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

const AuthWrapper = (props: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    if (session.data?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session.data?.error]);

  return props.children;
};

export default api.withTRPC(App);
