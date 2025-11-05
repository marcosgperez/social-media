import type { Metadata } from "next";
import "../styles/global.scss";
import StoreProvider from "@/lib/StoreProvider";

export const metadata: Metadata = {
  title: "Social Media",
  description: "Social media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
