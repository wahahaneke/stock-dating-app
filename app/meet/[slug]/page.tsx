import Link from "next/link";
import { Metadata } from "next";

// --- 1. 诱饵库 (数据源) ---
const ASSETS: Record<string, { name: string; type: string; icon: string; color: string; desc: string }> = {
  'bitcoin': { 
    name: "Bitcoin (BTC)", 
    type: "加密货币", 
    icon: "₿", 
    color: "text-yellow-500",
    desc: "寻找你的比特币持有者对象。这里有全网最多的 BTC 巨鲸。" 
  },
  'tesla': { 
    name: "Tesla (TSLA)", 
    type: "美股", 
    icon: "⚡", 
    color: "text-red-500",
    desc: "想和特斯拉股东约会？这里是 TSLA 信仰者的聚集地。" 
  },
  'nvidia': { 
    name: "Nvidia (NVDA)", 
    type: "AI芯片", 
    icon: "🤖", 
    color: "text-green-500",
    desc: "AI 时代最富有的单身贵族都在这里。寻找你的英伟达伴侣。" 
  },
  'gold': { 
    name: "Gold (XAU)", 
    type: "大宗商品", 
    icon: "🥇", 
    color: "text-yellow-400",
    desc: "稳健、多金。和持有黄金的成熟交易员开始一段关系。" 
  },
  'crypto': { 
    name: "Crypto", 
    type: "Web3", 
    icon: "🦄", 
    color: "text-purple-500",
    desc: "全球最大的加密货币交友社区。用钱包余额寻找真爱。" 
  },
};

// 定义参数类型 (适配 Next.js 15)
type Props = {
  params: Promise<{ slug: string }>
}

// --- 2. SEO 标题 (动态生成) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params; // 关键修复：等待参数解析
  const slug = resolvedParams.slug.toLowerCase();
  const asset = ASSETS[slug] || { name: slug.toUpperCase(), type: "金融", icon: "💰", color: "text-green-500", desc: "高端金融交友社区" };
  
  return {
    title: `${asset.name} 交易员交友/约会 App - 寻找持有 ${asset.name} 的另一半`,
    description: `BullDate 是全球首个 ${asset.name} 投资者专属交友平台。${asset.desc} 立即注册，查看附近持有 ${asset.name} 的高净值用户。`,
    keywords: `${asset.name}交友, ${asset.name}约会, 交易员找对象, 验资交友, 高端相亲`,
  };
}

// --- 3. 页面渲染 ---
export default async function AssetLandingPage({ params }: Props) {
  const resolvedParams = await params; // 关键修复：等待参数解析
  const slug = resolvedParams.slug.toLowerCase();
  
  // 如果找不到对应数据，就用默认的
  const asset = ASSETS[slug] || { 
    name: slug.toUpperCase(), 
    type: "热门资产", 
    icon: "🔥", 
    color: "text-green-500",
    desc: "用收益率证明实力，用真金白银寻找真爱。"
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* 顶部导航 */}
      <nav className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div className="text-xl font-black tracking-tighter">
          BULL<span className="text-green-500">DATE</span>
        </div>
        <Link href="/login" className="text-sm font-bold bg-green-600 text-black px-4 py-2 rounded-full hover:bg-green-500 transition">
          免费注册
        </Link>
      </nav>

      {/* 核心引流区 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
        
        <div className="text-8xl mb-6 animate-bounce">
          {asset.icon}
        </div>

        <div className="inline-block px-4 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-sm mb-6">
          💑 {asset.name} 专属交友区
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-4xl leading-tight">
          想和持有 <span className={asset.color}>{asset.name}</span> 的<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">高净值对象</span> 约会吗？
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          {asset.desc}<br/>
          拒绝杀猪盘，拒绝假照。BullDate 要求必须上传<b>{asset.name}</b>真实持仓截图才能加入。
        </p>

        {/* 转化按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Link 
            href="/dashboard"
            className="flex-1 bg-green-600 hover:bg-green-500 text-black font-bold text-lg py-4 px-8 rounded-full transition shadow-[0_0_30px_rgba(34,197,94,0.4)] text-center"
          >
            我是 {asset.name} 持有人
          </Link>
          <Link 
            href="/login"
            className="flex-1 border border-pink-600 text-pink-500 hover:bg-pink-900/20 font-bold text-lg py-4 px-8 rounded-full transition text-center"
          >
            我想认识 {asset.name} 大户
          </Link>
        </div>

        {/* 底部数据 */}
        <div className="mt-16 text-sm text-gray-600">
          <p>已验证 {asset.name} 资产总额: <span className="text-white font-mono">$482,000,000+</span></p>
          <p>昨日匹配成功: <span className="text-white font-mono">1,209</span> 对</p>
        </div>

      </div>
    </div>
  );
}