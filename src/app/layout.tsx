import "./globals.css";

import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const grotesque = Bricolage_Grotesque({
  variable: "--font-grotesque",
  subsets: ["latin"],
});

const neueMontreal = localFont({
  src: "../../public/static/fonts/pp-neue-montreal.woff2",
  variable: "--font-montreal",
  display: "swap",
  preload: true,
  fallback: [
    "Bricolage Grotesque",
    "Geist",
    "Inter",
    "system-ui",
    "sans-serif",
  ],
});
const neueMontrealMono = localFont({
  src: "../../public/static/fonts/pp-neue-montreal-mono.woff2",
  variable: "--font-montreal-mono",
  display: "swap",
  preload: true,
  fallback: ["Geist Mono", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Hexaa",
  description: "just a random guy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Suppress Hydration Warning because of Next Themes. */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${grotesque.variable} ${neueMontreal.variable} ${neueMontrealMono.variable} font-grotesque antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
