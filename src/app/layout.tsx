import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phoslab — Le labo de la lumière",
  description: "Posez une question. Recevez pas une réponse — recevez la carte du territoire.",
  openGraph: {
    title: "Phoslab",
    description: "L'information éclairée. Ce qu'on sait, ce qu'on ne sait pas, et qui dit quoi.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
