import { WithAuthenticationContext } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import ConditionalPublicNavbar from "./ui/ConditionalPublicNavbar";
import Footer from "./ui/footer";

const insitutrialRegular = localFont({
  src: "./fonts/for-insitutrial-regular.otf",
  variable: "--font-insitutrial-regular",
});

const insitutrialBold = localFont({
  src: "./fonts/for-insitutrial-bold.otf",
  variable: "--font-insitutrial-bold",
});

export const metadata: Metadata = {
  title: "Pile-xp",
  description: "Agence d’architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${insitutrialRegular.variable} ${insitutrialBold.variable} antialiased flex flex-col justify-between`}
      >
        <WithAuthenticationContext
          initialState={{
            isLoggedIn: false,
          }}
        >
          <ConditionalPublicNavbar />
          <main className="mb-auto min-h-screen">
            {children}
          </main>
        </WithAuthenticationContext>
        <Footer />
      </body>
    </html>
  );
}
