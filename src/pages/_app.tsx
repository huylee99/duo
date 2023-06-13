import "~/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { api } from "~/server/utils/api";

const App: AppType<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(App);
