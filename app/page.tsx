import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">
      {/* 顶部导航 */}
      <nav className="w-full p-6 flex justify-between items-center border-b border-gray-800">
        <div className="text-2xl font-bold text-green-500 tracking-tighter">
          BULL<span className="text-white">DATE</span>
        </div>
        <div className="space-x-4">
          <Link 
            href="/login"
            className="text-sm font-medium text-gray-400 hover:text-white transition"
          >
            登录
          </Link>
          <Link 
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-black font-bold py-2 px-4 rounded-full text-sm transition"
          >
            加入会员
          </Link>
        </div>
      </nav>

      {/* 核心区域 */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 px-8 mt-10">
        
        {/* 标签 */}
        <div className="inline-block bg-green-900/30 border border-green-800 rounded-full px-4 py-1 mb-6">
          <span className="text-green-400 text-xs font-mono uppercase tracking-widest">
            ● 仅限持仓验证用户
          </span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          让<span className="text-green-500">收益率</span><br />
          决定你的魅力
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          别再刷虚假的豪车照片了。在这里，红色是唯一的性感。
          连接经过验证的高净值交易者，寻找你的 Alpha 伴侣。
        </p>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg py-4 px-10 rounded-xl transition shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center"
          >
            上传持仓截图 &rarr;
          </Link>
          <Link 
            href="/login"
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium text-lg py-4 px-10 rounded-xl border border-gray-700 transition flex items-center justify-center"
          >
            我是来围观大神的
          </Link>
        </div>

        {/* 底部信任背书 */}
        <div className="mt-20 pt-10 border-t border-gray-900 w-full max-w-4xl grid grid-cols-3 gap-8 text-gray-500 text-center">
          <div>
            <h3 className="text-2xl font-bold text-white">$2.4M+</h3>
            <p className="text-sm">验证资产总额</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">1,024</h3>
            <p className="text-sm">活跃交易员</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Top 1%</h3>
            <p className="text-sm">用户质量</p>
          </div>
        </div>
      </div>
    </main>
  );
}