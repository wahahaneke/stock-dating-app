import Link from "next/link";
import { Metadata } from "next";

// --- 1. 这是我们的“诱饵库” (SEO 数据源) ---
// 你可以在这里无限添加新的股票或币种
const ASSETS: Record<string, { name: string; type: string; icon: string; color: string }> = {
  'bitcoin': { name: "Bitcoin (BTC)", type: "加密货币", icon: "₿", color: "text-yellow-500" },
  'ethereum': { name: "Ethereum (ETH)", type: "加密货币", icon: "Ξ", color: "text-purple-500" },
  'tesla': { name: "Tesla (TSLA)", type: "美股", icon: "⚡", color: "text-red-500" },
  'nvidia': { name: "Nvidia (NVDA)", type: "AI芯片", icon: "🤖", color: "text-green-500" },
  'gold': { name: "Gold (XAU)", type: "大宗商品", icon: "🥇", color: "text-yellow-400" },
  'apple': { name: "Apple (AAPL)", type: "科技股", icon: "🍎", color: "text-gray-400" },
  'doge': { name: "Dogecoin", type: "Meme币", icon: "🐕", color: "text-yellow-600" },
  'solana': { name: "Solana (SOL)", type: "公链", icon: "◎", color: "text-purple-400" },
  'forex': { name: "Forex (外汇)", type: "外汇", icon: "💱", color: "text-green-400" },
  'futures': { name: "Futures (期货)", type: "衍生品", icon: "📉", color: "text-blue-500" },
};

// --- 2. 告诉 Google 这个页面的标题是什么 (动态生成) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug.toLowerCase();
  const asset = ASSETS[slug] || { name: slug.toUpperCase(), type: "资产", icon: "💰", color: "text-green-500" };
  
  return {
    title: `${asset.name} 交易员专属交友社区 | BullDate`,
    description: `寻找持有 ${asset.name} 的高净值投资者？加入 BullDate，验证持仓，结识真正的 ${asset.name} 巨鲸和 Alpha 玩家。`,
  };
}

// --- 3. 页面渲染逻辑 ---
export default function AssetLandingPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();
  // 如果找不到对应数据，就用默认的
  const asset = ASSETS[slug] || { 
    name: slug.toUpperCase(), 
    type: "热门资产", 
    icon: "🔥", 
    color: "text-green-500" 
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* 顶部导航 */}
      <nav className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div className="text-xl font-black tracking-tighter">
          BULL<span className="text-green-500">DATE</span>
        </div>
        <Link href="/login" className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200">
          登录 / 注册
        </Link>
      </nav>

      {/* 核心引流区 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        
        {/* 动态图标 */}
        <div className="text-8xl mb-6 animate-bounce">
          {asset.icon}
        </div>

        {/* 动态标题 */}
        <div className="inline-block px-4 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-sm mb-6">
          专属于 {asset.type} 玩家的圈子
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-4xl leading-tight">
          你持有 <span className={asset.color}>{asset.name}</span> 吗？<br/>
          在这里找到你的同路人。
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          BullDate 是全球首个基于持仓验证的社交平台。<br/>
          如果你在 {asset.name} 上赚到了钱，或者正在寻找信仰者，这里就是你的家。
        </p>

        {/* 转化按钮 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard"
            className="bg-green-600 hover:bg-green-500 text-black font-bold text-lg py-4 px-12 rounded-full transition shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            我是 {asset.name} 持有人 ->
          </Link>
          <Link 
            href="/login"
            className="border border-gray-700 hover:border-gray-500 text-white font-bold text-lg py-4 px-12 rounded-full transition"
          >
            我想认识 {asset.name} 大户
          </Link>
        </div>

        {/* 信任背书 (模拟数据) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center w-full max-w-4xl border-t border-gray-900 pt-10">
          <div>
            <div className="text-2xl font-bold text-white">12,403</div>
            <div className="text-xs text-gray-500">{asset.name} 持有者</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">$480M+</div>
            <div className="text-xs text-gray-500">验证总市值</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Top 1%</div>
            <div className="text-xs text-gray-500">平均收益率</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24h</div>
            <div className="text-xs text-gray-500">审核时效</div>
          </div>
        </div>

      </div>
    </div>
  );
}