import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SEO } from "@/_constants/appConfigConstants";
import Navbar from "./_components/NavbarComponents/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { Providers } from "./providers";
import LoginPage from "./login/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {session?.user ? (
            <>
              <Navbar session={session!} />
              {children}
            </>
          ) : (
            <LoginPage />
          )}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
