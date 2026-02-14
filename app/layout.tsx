import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://vittoriorivabella.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vittorio Rivabella — Engineer, AI Researcher & Speaker",
    template: "%s | Vittorio Rivabella",
  },
  description:
    "Vittorio Rivabella is an engineer, AI researcher, and speaker specializing in AI security, smart contract auditing, and developer tooling. Currently AI Coordinator at the Ethereum Foundation.",
  keywords: [
    "Vittorio Rivabella",
    "AI researcher",
    "AI security",
    "smart contract auditor",
    "Ethereum Foundation",
    "Web3 developer",
    "software engineer",
    "speaker",
    "developer relations",
    "blockchain",
    "machine learning",
  ],
  authors: [{ name: "Vittorio Rivabella", url: SITE_URL }],
  creator: "Vittorio Rivabella",
  openGraph: {
    title: "Vittorio Rivabella — Engineer, AI Researcher & Speaker",
    description:
      "Engineer, AI researcher, and speaker. AI Coordinator at the Ethereum Foundation. Building at the intersection of AI security, smart contracts, and developer tooling.",
    url: SITE_URL,
    siteName: "Vittorio Rivabella",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vittorio Rivabella — Engineer, AI Researcher & Speaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vittorio Rivabella — Engineer, AI Researcher & Speaker",
    description:
      "Engineer, AI researcher, and speaker. AI Coordinator at the Ethereum Foundation.",
    creator: "@vittostack",
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
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
