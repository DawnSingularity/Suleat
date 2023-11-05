import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";

// Import Font Awesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Suleat",
  description: "Developed by Suleat Team",
  icons: [{ rel: "icon", url: "/suleat-icon.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
          <Toaster/>
          <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
