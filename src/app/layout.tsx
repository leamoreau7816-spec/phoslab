import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phoslab — The light lab",
  description: "Ask a question. Don't get an answer — get the map of the territory.",
  openGraph: {
    title: "Phoslab",
    description: "Illuminated information. What we know, what we don't, and who says what.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
