import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DesignTokensProvider } from "@/lib/design-tokens-context";
import { Navigation } from "@/ui/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Token Forge - UI Design System Generator",
  description:
    "Generate base UI design tokens following Practical UI design principles",
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
