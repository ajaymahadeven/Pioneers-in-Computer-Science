import "@/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SearchProvider } from "@/components/search-palette/SearchProvider";

const APP_URL = "https://pioneers-in-cs.com";
const TITLE = "Pioneers in Computer Science";
const DESCRIPTION =
  "An interactive encyclopedia of the 184 most influential pioneers in computer science history — from Ada Lovelace to Alan Turing, spanning 12 centuries of innovation.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: `%s | ${TITLE}`,
  },
  description: DESCRIPTION,
  keywords: [
    "computer science",
    "pioneers",
    "history",
    "encyclopedia",
    "Alan Turing",
    "Ada Lovelace",
    "programming",
    "technology history",
    "computer scientists",
    "innovation",
  ],
  authors: [{ name: "Pioneers in Computer Science" }],
  creator: "Pioneers in Computer Science",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pioneers in Computer Science",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
  colorScheme: "light dark",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SearchProvider>
              <SiteHeader />
              {children}
            </SearchProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
