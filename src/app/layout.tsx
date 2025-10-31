import { WithAuthenticationContext } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import ConditionalPublicNavbar from "./ui/ConditionalPublicNavbar";
import Footer from "./ui/footer";
import { Analytics } from "@vercel/analytics/next"
const insitutrialRegular = localFont({
  src: "./fonts/for-insitutrial-regular.otf",
  variable: "--font-insitutrial-regular",
});

const insitutrialBold = localFont({
  src: "./fonts/for-insitutrial-bold.otf",
  variable: "--font-insitutrial-bold",
});


export const metadata: Metadata = {
  title: {
    default: "PILE.XP — Agence d’architecture",
    template: "%s | PILE.XP",
  },
  description:
    "PILE.XP est une agence d’architecture contemporaine et créative basée en France. Découvrez nos projets, notre approche et nos inspirations.",
  keywords: ["architecture", "design", "PILE.XP", "projets", "France"],
  metadataBase: new URL("https://www.pile-xp.com/"),
  openGraph: {
    title: "PILE.XP — Agence d’architecture contemporaine",
    description:
      "Découvrez PILE.XP, agence d’architecture audacieuse et innovante. Projets en France et à l’international.",
    url: "https://www.pile-xp.com/",
    siteName: "PILE.XP",
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
            <Analytics />
          </main>
        </WithAuthenticationContext>
        <Footer />
      </body>
    </html>
  );
}
