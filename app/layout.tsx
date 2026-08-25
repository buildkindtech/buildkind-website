import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JsonLd } from "./json-ld";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://buildkind.tech"),
  title: "BuildKind Tech — Frame Shop Websites, SimpleFrame & Lower Card Fees",
  description:
    "BuildKind builds modern websites and SimpleFrame POS for custom frame shops — including a merchant fee guarantee to beat the card-processing fees you currently pay.",
  keywords:
    "frame shop website, custom framing website, framing software, SimpleFrame, merchant processing, card processing fees, online framing quote, frame shop workflow, framing calculator",
  alternates: {
    canonical: "https://buildkind.tech",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "BuildKind Tech — Frame Shop Websites, SimpleFrame & Lower Card Fees",
    description:
      "Websites, SimpleFrame POS, and a merchant fee guarantee: shops pay lower card-processing fees than they currently pay.",
    url: "https://buildkind.tech",
    siteName: "BuildKind Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildKind Tech — Frame Shop Websites, SimpleFrame & Lower Card Fees",
    description: "Websites, SimpleFrame POS, and a merchant fee guarantee for custom frame shops.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
