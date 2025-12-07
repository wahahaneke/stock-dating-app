import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BullSocial | 战绩社交",
  description: "晒单、吐槽、围观大神。全球首个基于持仓收益率验证的交易员社区。",
  manifest: "/manifest.json",
  // ✨ 新增：显式告诉所有设备图标在哪里
  icons: {
    icon: '/icon.png',
    apple: '/icon.png', // 专门给 iPhone 看的
  },
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "拼牛股",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-black text-white`}>{children}</body>
    </html>
  );
}