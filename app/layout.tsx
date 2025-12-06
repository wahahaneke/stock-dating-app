import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BullDate | 仅限高净值交易员的精英交友社区",
  description: "别再刷虚假的豪车照片了。BullDate 是全球首个基于持仓收益率验证的交友平台。",
  keywords: "股票交友, 交易员约会, 高端交友, 验资交友, 币圈交友, 投资社区",
  // --- 新增：Google 站长验证暗号 ---
  verification: {
    google: "zn8nqZshVcyaRnxxKJhks1HnzsNNobrHRR8eVKXdJ74",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-black text-white flex flex-col min-h-screen`}>
        
        {/* 页面主体内容 */}
        <div className="flex-1">
          {children}
        </div>

        {/* --- SEO 强力脚手架 (Footer) --- */}
        <footer className="border-t border-gray-900 bg-[#050505] py-12 mt-10">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            
            {/* 品牌栏 */}
            <div className="col-span-1">
              <div className="text-2xl font-black tracking-tighter mb-4">
                BULL<span className="text-green-500">DATE</span>
              </div>
              <p className="text-gray-500 text-sm">
                让收益率决定你的魅力。<br/>
                全球首个验资交友社区。
              </p>
              <div className="mt-4 text-xs text-gray-600">
                &copy; 2024 BullDate Inc.
              </div>
            </div>

            {/* 热门股票入口 */}
            <div>
              <h4 className="font-bold text-white mb-4">热门股票圈子</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/meet/tesla" className="hover:text-green-500 transition">Tesla (TSLA) 交友</Link></li>
                <li><Link href="/meet/nvidia" className="hover:text-green-500 transition">Nvidia (NVDA) 约会</Link></li>
                <li><Link href="/meet/apple" className="hover:text-green-500 transition">Apple (AAPL) 社区</Link></li>
                <li><Link href="/meet/gamestop" className="hover:text-green-500 transition">GameStop (GME) 信仰</Link></li>
              </ul>
            </div>

            {/* 热门加密货币入口 */}
            <div>
              <h4 className="font-bold text-white mb-4">加密货币圈子</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/meet/bitcoin" className="hover:text-green-500 transition">Bitcoin (BTC) 大户</Link></li>
                <li><Link href="/meet/ethereum" className="hover:text-green-500 transition">Ethereum (ETH) 巨鲸</Link></li>
                <li><Link href="/meet/solana" className="hover:text-green-500 transition">Solana (SOL) 玩家</Link></li>
                <li><Link href="/meet/doge" className="hover:text-green-500 transition">Dogecoin (DOGE) 家人</Link></li>
              </ul>
            </div>

            {/* 其他资产 */}
            <div>
              <h4 className="font-bold text-white mb-4">更多资产</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/meet/gold" className="hover:text-green-500 transition">黄金 (Gold) 投资者</Link></li>
                <li><Link href="/meet/forex" className="hover:text-green-500 transition">外汇 (Forex) 操盘手</Link></li>
                <li><Link href="/meet/futures" className="hover:text-green-500 transition">期货 (Futures) 大佬</Link></li>
                <li><Link href="/login" className="text-green-600 hover:text-green-400 transition">申请上币/上股 &rarr;</Link></li>
              </ul>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}