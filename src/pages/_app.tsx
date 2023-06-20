import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { type NextPage } from "next";
import { api } from "~/server/utils/api";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { type ReactElement, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: Session;
};

const App = ({ Component, pageProps, session }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <>
      <main className={inter.className}>
        <SessionProvider session={pageProps.session || session} refetchOnWindowFocus={false}>
          {getLayout(
            <ThemeProvider>
              <Component {...pageProps} />
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
            </ThemeProvider>
          )}
        </SessionProvider>
      </main>
    </>
  );
};

export default api.withTRPC(App);
