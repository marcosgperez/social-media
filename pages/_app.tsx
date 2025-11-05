import type { AppProps } from "next/app";
import StoreProvider from "@/lib/StoreProvider";
import { AuthHydration } from "@/components/AuthHydration";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <StoreProvider>
      <AuthHydration>
        <Component {...pageProps} />
      </AuthHydration>
    </StoreProvider>
  );
};

export default MyApp;