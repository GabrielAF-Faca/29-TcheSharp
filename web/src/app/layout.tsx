import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loci",
  description: "Além da visão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
