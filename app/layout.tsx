import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildKind Tech — Frame Shop Technology",
  description: "Custom websites and SimpleFrame SaaS platform built specifically for frame shops. Faster quotes, online ordering, and beautiful galleries.",
  keywords: "frame shop website, framing software, SimpleFrame, custom framing website, framing calculator",
  openGraph: {
    title: "BuildKind Tech — Frame Shop Technology",
    description: "Custom websites and SimpleFrame SaaS built for frame shops.",
    url: "https://buildkind.tech",
    siteName: "BuildKind Tech",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
