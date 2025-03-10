import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { DM_Sans } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner';
// import { FormLabel } from '@/components/ui/form';

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${dmSans.className}`}>
          <Providers>
            <Suspense fallback={null}>
            <div className="root-layout">{children}</div>
            <Toaster richColors closeButton></Toaster>
            </Suspense>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
