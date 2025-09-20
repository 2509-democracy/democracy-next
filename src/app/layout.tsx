import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ハッカソン・デベロッパー",
  description: "技術カードを使ってアイデアを競うハッカソンゲーム！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <title>ハッカソン・デベロッパー</title>
        <meta property="og:title" content="ハッカソン・デベロッパー" />
        <meta
          property="og:description"
          content="技術カードを使ってアイデアを競うハッカソンゲーム！"
        />
        <meta property="og:url" content="https://democracy.thirdlf03.com/" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
