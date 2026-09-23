import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BS Retail Management",
  description: "Sistem Manajemen Bad Stock",
  themeColor: "#E11D74",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-[#FFF0F5] antialiased`}>
        {children}
      </body>
    </html>
  );
}
