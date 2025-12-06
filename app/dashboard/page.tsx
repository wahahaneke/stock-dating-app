'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// --- 模拟数据：适配 Moonshot 风格 ---
const TRADERS = [
  { name: "Pippin_Whale", profit: "+30.58%", asset: "$247M", avatar: "🐡", tag: "上线", status: "up" },
  { name: "Franklin_G", profit: "+467.95%", asset: "$12K", avatar: "🐢", tag: "热门", status: "up" },
  { name: "Ai16z_Bot", profit: "+109.63%", asset: "$4.2M", avatar: "🤖", tag: "AI", status: "up" },
  { name: "MoonDog", profit: "+10.6%", asset: "$531K", avatar: "🐕", tag: "Meme", status: "up" },
  { name: "SadFrog", profit: "-2.4%", asset: "$10K", avatar: "🐸", tag: "Rekt", status: "down" },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [activeTab, setActiveTab] = useState('home') // 控制底部导航切换: home, create, gift, profile
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

  // 上传逻辑
  const processUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('proofs').upload(fileName, file)
      if (error) throw error
      alert('✅ 提交成功！审核中...')
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

  if (loading) return <div className="min-h-screen bg-[#0b0b15] flex items-center justify-center text-[#d936f3]">LOADING...</div>

  return (
    <div className="min-h-screen bg-[#0b0b15] text-white font-sans pb-24">
      
      {/* ============ 顶部搜索栏 (Moonshot 风格) ============ */}
      <div className="fixed top-0 w-full z-50 bg-[#0b0b15] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400">
          🕒
        </div>
        <div className="flex-1 bg-[#1a1a24] rounded-full h-10 flex items-center px-4 text-sm text-gray-400">
          🔍 搜索交易员...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1a1a24] flex items-center justify-center text-gray-400">
          ⚙️
        </div>
      </div>

      {/* ============ 主内容区域 (根据 Tab 切换) ============ */}
      <main className="pt-20 px-4">
        
        {/* TAB 1: 首页 (Home) */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-6">
            
            {/* 总资产卡片 */}
            <div>
              <p className="text-gray-400 text-sm">全网总资产</p>
              <h1 className="text-4xl font-bold mt-1">$2.45<span className="text-gray-500">M</span> <span className="text-sm text-gray-500 align-middle">›</span></h1>
            </div>

            {/* 当下焦点 (Feature Card) */}
            <div>
              <h3 className="text-lg font-bold mb-3">📢 当下焦点</h3>
              <div className="bg-[#1a1a24] rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">🐡</div>
                    <div>
                      <div className="font-bold text-lg">Pippin Whale</div>
                      <div className="text-sm text-gray-400">Pippin</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#d936f3] font-bold flex items-center gap-1">
                    ● 上线
                  </div>
                </div>
                <div className="mt-4 text-[#3df2a3] font-bold text-lg">
                  ▲ 30.58% <span className="text-sm text-gray-500 font-normal">过去1天</span>
                </div>
              </div>
            </div>

            {/* 涨幅榜 / 热门列表 */}
            <div>
              <div className="flex gap-6 text-sm font-bold text-gray-400 mb-4 border-b border-gray-800 pb-2">
                <span className="text-white border-b-2 border-white pb-2">🔥 热门</span>
                <span>🏆 涨幅</span>
                <span>⚡ 活跃</span>
                <span>👀 你的</span>
              </div>

              <div className="space-y-4">
                {TRADERS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-xl">
                        {item.avatar}
                      </div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.asset} 市值</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">$0.0248</div>
                      <div className={`text-xs ${item.status === 'up' ? 'text-[#3df2a3]' : 'text-red-500'}`}>
                        {item.status === 'up' ? '▲' : '▼'} {item.profit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 创建/上传 (Create) */}
        {activeTab === 'create' && (
          <div className="animate-fade-in flex flex-col items-center justify-center h-[70vh] text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a24] flex items-center justify-center text-5xl mb-6 shadow-[0_0_30px_rgba(217,54,243,0.3)]">
              📸
            </div>
            <h2 className="text-2xl font-bold mb-2">验证你的身价</h2>
            <p className="text-gray-400 text-sm mb-8 px-8">
              上传券商持仓截图。通过验证后，你将出现在首页“热门榜单”中。
            </p>
            
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*"/>
            
            <button 
              onClick={triggerClick}
              disabled={uploading}
              className="bg-[#d936f3] hover:bg-[#b022c6] text-white font-bold py-4 px-12 rounded-full w-full max-w-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              {uploading ? '加密上传中...' : '+ 上传持仓截图'}
            </button>
            <p className="mt-4 text-xs text-gray-600">仅支持实盘数据，严禁P图</p>
          </div>
        )}

        {/* TAB 3: 礼物/邀请 (Gift) */}
        {activeTab === 'gift' && (
          <div className="animate-fade-in text-center pt-10">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#d936f3] to-purple-700 rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl">
              $
            </div>
            <h2 className="text-xl font-bold mb-10">邀请好友即刻赚取现金</h2>
            
            <div className="flex justify-center gap-8 mb-10">
               <div className="flex flex-col items-center">
                 <div className="w-12 h-12 rounded-full bg-[#1a1a24] flex items-center justify-center mb-2 border border-gray-700">
                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                 </div>
                 <span className="text-xs text-gray-400">您</span>
               </div>
               <div className="flex flex-col items-center opacity-50">
                 <div className="w-12 h-12 rounded-full bg-[#1a1a24] flex items-center justify-center mb-2 border border-dashed border-gray-600">
                   +
                 </div>
                 <span className="text-xs text-gray-400">直接推荐</span>
               </div>
            </div>

            <button className="bg-[#d936f3] text-white font-bold py-4 w-full rounded-full mb-4">
              邀请好友
            </button>
            <p className="text-xs text-gray-500">*奖励以完全抵押的稳定币 USDC 发放。</p>
          </div>
        )}

        {/* TAB 4: 持仓/个人 (Profile) */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in text-center pt-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 mb-3 overflow-hidden border-2 border-[#3df2a3]">
               <div className="w-full h-full flex items-center justify-center text-3xl">😎</div>
            </div>
            <h2 className="text-lg font-bold">@{user.email?.split('@')[0]}</h2>
            <div className="text-xs text-[#3df2a3] bg-[#3df2a3]/10 inline-block px-2 py-1 rounded mt-1">
              {isVerified ? '已验证大户' : '未验证用户'}
            </div>

            <div className="mt-8 mb-2 text-gray-400 text-sm">BullDate 上总资产</div>
            <div className="text-4xl font-bold mb-2">$0.00</div>
            <div className="text-sm text-gray-500">▲ 0% 所有时间</div>

            <div className="flex justify-center gap-8 mt-8 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#d936f3] flex items-center justify-center text-xl">💲</div>
                <span className="text-xs font-bold">充值</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1a1a24] flex items-center justify-center text-xl">🚀</div>
                <span className="text-xs font-bold">发送</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#d936f3] flex items-center justify-center text-xl">🏦</div>
                <span className="text-xs font-bold">提现</span>
              </div>
            </div>
            
            <div className="bg-[#1a1a24] mx-auto p-6 rounded-2xl text-left border border-white/5 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-1">进行您的第一次验证</h3>
                 <p className="text-xs text-gray-400 mb-4">上传截图，解锁 VIP 标识</p>
                 <button onClick={() => setActiveTab('create')} className="bg-[#d936f3] px-6 py-2 rounded-full text-sm font-bold">
                   去验证
                 </button>
               </div>
            </div>
          </div>
        )}

      </main>

      {/* ============ 底部导航栏 (Bottom Navigation) ============ */}
      <div className="fixed bottom-0 w-full bg-[#0b0b15] border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-50">
        
        {/* 1. 首页 */}
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-white' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px]">首页</span>
        </button>

        {/* 2. 创建 (核心按钮) */}
        <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center gap-1 ${activeTab === 'create' ? 'text-white' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span className="text-[10px]">创建</span>
        </button>

        {/* 3. 礼物 */}
        <button onClick={() => setActiveTab('gift')} className={`flex flex-col items-center gap-1 ${activeTab === 'gift' ? 'text-white' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'gift' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          <span className="text-[10px]">礼物</span>
        </button>

        {/* 4. 持仓/我的 */}
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-white' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'profile' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span className="text-[10px]">持仓</span>
        </button>

      </div>
    </div>
  )
}