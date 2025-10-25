import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Mark",
  description:
    "A modern bookmark manager for organizing and managing your favorite books using Google Books APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(plusJakartaSans.className)}>
        <Providers>
          <Header />
          <div className="mx-auto min-h-dvh w-full max-w-5xl p-4 pt-[88px]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
