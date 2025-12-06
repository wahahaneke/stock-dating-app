'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// --- 模拟真实用户数据 (社交+带单) ---
const TRADERS = [
  { 
    id: 1, 
    name: "Jessica_W", 
    tag: "美股期权", 
    profit: "+342%", 
    asset: "$2.4M", 
    desc: "专注 TSLA/NVDA 期权策略。不闲聊，只搞钱。",
    avatar: "👩‍💼",
    online: true 
  },
  { 
    id: 2, 
    name: "Crypto_King", 
    tag: "BTC 现货", 
    profit: "+89%", 
    asset: "$12.8M", 
    desc: "穿梭于牛熊周期的老韭菜。带你逃顶抄底。",
    avatar: "🧔",
    online: false 
  },
  { 
    id: 3, 
    name: "Forex_Hunter", 
    tag: "外汇日内", 
    profit: "+22%", 
    asset: "$850K", 
    desc: "欧美/磅美高频交易。寻找志同道合的 Alpha 伴侣。",
    avatar: "👱‍♂️",
    online: true 
  },
  { 
    id: 4, 
    name: "ETH_Lady", 
    tag: "链上土狗", 
    profit: "+1,024%", 
    asset: "$5.1M", 
    desc: "MEME 币一级市场猎手。风险极高，心脏不好勿扰。",
    avatar: "👩‍🎤",
    online: true 
  },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [activeTab, setActiveTab] = useState('feed') // feed, upload, chat, mine
  const [loading, setLoading] = useState(true)
  
  // 上传相关
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
      try {
        const { data: profile } = await supabase
          .from('profiles').select('is_verified').eq('id', user.id).single()
        if (profile) setIsVerified(profile.is_verified)
      } catch (e) {}
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // 交互逻辑
  const handleConnect = (name: string) => {
    if (!isVerified) {
      alert('🔒 请先上传持仓截图验证身份！\n\n只有验证用户才能发起私聊。')
      setActiveTab('upload')
    } else {
      alert(`🚀 已向 ${name} 发送好友申请！\n\n对方通过后即可开始聊天。`)
    }
  }

  const handleCopyTrade = (name: string) => {
    if (!isVerified) {
      alert('🔒 请先验证身份！')
      setActiveTab('upload')
    } else {
      alert(`📊 已关注 ${name} 的实盘信号！\n\n当他开单时你会收到通知。`)
    }
  }

  // 上传逻辑
  const processUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('proofs').upload(fileName, file)
      if (error) throw error
      alert('✅ 截图提交成功！系统正在核验...')
    } catch (error: any) {
      alert('上传失败: ' + error.message)
    } finally {
      setUploading(false)
    }
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processUpload(e.target.files[0])
  }
  const triggerClick = () => fileInputRef.current?.click()

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans pb-24">
      
      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-black tracking-tighter text-white">
          BULL<span className="text-green-500">DATE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
            {isVerified ? '✅ 已验证' : '🛡️ 游客'}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        
        {/* TAB 1: 广场 (Feed) */}
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-fade-in">
            {/* 顶部提示 */}
            {!isVerified && (
              <div 
                onClick={() => setActiveTab('upload')}
                className="bg-gradient-to-r from-green-900/40 to-black border border-green-500/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-green-400">尚未验证身份</div>
                  <div className="text-xs text-gray-400">上传持仓解锁聊天与跟单功能</div>
                </div>
                <div className="bg-green-600 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                  去验证
                </div>
              </div>
            )}

            {/* 交易员卡片流 */}
            {TRADERS.map((trader) => (
              <div key={trader.id} className="bg-[#111] border border-gray-800 rounded-3xl overflow-hidden shadow-lg">
                {/* 头部信息 */}
                <div className="p-5 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-3xl border-2 border-gray-700">
                        {trader.avatar}
                      </div>
                      {trader.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]"></div>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        {trader.name}
                        <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded border border-gray-700">{trader.tag}</span>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{trader.desc}</p>
                    </div>
                  </div>
                </div>

                {/* 核心数据展示 (最重要的地方) */}
                <div className="px-5 pb-5">
                  <div className="bg-[#0a0a0a] rounded-2xl p-4 flex justify-between items-center border border-gray-800">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">本月收益</div>
                      <div className="text-2xl font-black text-green-500">{trader.profit}</div>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-800"></div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">实盘资产</div>
                      <div className="text-lg font-bold text-white">{trader.asset}</div>
                    </div>
                  </div>
                </div>

                {/* 底部操作栏 */}
                <div className="grid grid-cols-2 border-t border-gray-800">
                  <button 
                    onClick={() => handleConnect(trader.name)}
                    className="py-4 text-sm font-bold text-gray-300 hover:bg-gray-900 transition flex items-center justify-center gap-2"
                  >
                    💬 私聊
                  </button>
                  <button 
                    onClick={() => handleCopyTrade(trader.name)}
                    className="py-4 text-sm font-bold text-green-500 hover:bg-green-900/20 transition flex items-center justify-center gap-2 border-l border-gray-800"
                  >
                    ⚡ 跟单
                  </button>
                </div>
              </div>
            ))}
            
            <p className="text-center text-xs text-gray-600 pt-4">到底了，更多大神正在验证中...</p>
          </div>
        )}

        {/* TAB 2: 上传/验证 (Upload) */}
        {activeTab === 'upload' && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-900/20 flex items-center justify-center text-4xl mb-6 text-green-500">
              📸
            </div>
            <h2 className="text-2xl font-bold mb-3">晒出你的实力</h2>
            <p className="text-gray-400 text-sm mb-8 px-8 max-w-sm">
              BullDate 是靠实力说话的社区。<br/>上传券商/交易所持仓截图，获得“实盘”标识。
            </p>
            
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*"/>
            
            <button 
              onClick={triggerClick}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-500 text-black font-bold py-4 px-12 rounded-full w-full max-w-xs transition shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            >
              {uploading ? '加密传输中...' : '上传持仓截图'}
            </button>
            <div className="mt-8 flex gap-4 text-xs text-gray-600">
              <span>🔒 隐私加密</span>
              <span>👁️ 仅展示收益率</span>
            </div>
          </div>
        )}

        {/* TAB 3: 聊天列表 (Chat) */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in text-center pt-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">暂无消息</h3>
            <p className="text-gray-500 text-sm px-10">
              去广场看看吧！<br/>点击“私聊”或“跟单”即可开启对话。
            </p>
            <button onClick={() => setActiveTab('feed')} className="mt-8 text-green-500 border border-green-800 px-6 py-2 rounded-full text-sm">
              去逛逛
            </button>
          </div>
        )}

        {/* TAB 4: 个人中心 (Mine) */}
        {activeTab === 'mine' && (
          <div className="animate-fade-in">
            <div className="bg-[#111] rounded-3xl p-6 border border-gray-800 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl border border-gray-700">
                  😎
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.email?.split('@')[0]}</h2>
                  <div className="text-xs text-gray-500 mt-1">UID: {user.id.slice(0, 6)}...</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="bg-black rounded-xl p-3">
                  <div className="text-xs text-gray-500">粉丝</div>
                  <div className="font-bold text-white">0</div>
                </div>
                <div className="bg-black rounded-xl p-3">
                  <div className="text-xs text-gray-500">关注</div>
                  <div className="font-bold text-white">0</div>
                </div>
                <div className="bg-black rounded-xl p-3">
                  <div className="text-xs text-gray-500">收益</div>
                  <div className="font-bold text-green-500">--</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-[#111] p-4 rounded-xl flex justify-between items-center text-sm hover:bg-gray-800">
                <span>⚙️ 账户设置</span>
                <span className="text-gray-600">›</span>
              </button>
              <button className="w-full bg-[#111] p-4 rounded-xl flex justify-between items-center text-sm hover:bg-gray-800">
                <span>📜 我的晒单记录</span>
                <span className="text-gray-600">›</span>
              </button>
              <button className="w-full bg-[#111] p-4 rounded-xl flex justify-between items-center text-sm hover:bg-gray-800 text-red-500">
                <span>🚪 退出登录</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 w-full bg-black/95 border-t border-gray-800 pb-6 pt-3 px-6 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'feed' ? 'text-green-500' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span className="text-[10px]">广场</span>
        </button>
        
        <button onClick={() => setActiveTab('upload')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'upload' ? 'text-green-500' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span className="text-[10px]">晒单</span>
        </button>

        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'chat' ? 'text-green-500' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="text-[10px]">消息</span>
        </button>

        <button onClick={() => setActiveTab('mine')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'mine' ? 'text-green-500' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px]">我的</span>
        </button>
      </div>
    </div>
  )
}