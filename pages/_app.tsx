import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/lib/StoreProvider";
import { AuthHydration } from "@/components/AuthHydration";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <AuthHydration>
          <Component {...pageProps} />
        </AuthHydration>
      </StoreProvider>
    </SessionProvider>
  );
};

export default MyApp;