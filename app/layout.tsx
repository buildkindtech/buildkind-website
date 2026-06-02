import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildKind Tech — Frame Shop Websites & Ordering Workflows",
  description:
    "BuildKind builds modern websites, SimpleFrame ordering tools, and practical workflow systems for custom frame shops.",
  keywords:
    "frame shop website, custom framing website, framing software, SimpleFrame, online framing quote, frame shop workflow, framing calculator",
  openGraph: {
    title: "BuildKind Tech — Frame Shop Websites & Ordering Workflows",
    description:
      "Websites, quote flows, online ordering, and SimpleFrame technology built specifically for custom frame shops.",
    url: "https://buildkind.tech",
    siteName: "BuildKind Tech",
  },
  twitter: {
    card: "summary",
    title: "BuildKind Tech — Frame Shop Websites & Ordering Workflows",
    description: "Websites and ordering workflows built specifically for custom frame shops.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
