import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { DesignTokensProvider } from "@/lib/design-tokens-context";
import { Navigation } from "@/ui/components/navigation";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "Generate base UI design tokens following Practical UI design principles",
  title: "Token Forge - UI Design System Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DesignTokensProvider>
          <Navigation />
          <main className="min-h-screen bg-background">{children}</main>
        </DesignTokensProvider>
      </body>
    </html>
  );
}
