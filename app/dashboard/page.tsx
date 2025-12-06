'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// --- 模拟数据：更丰富，带标签 ---
const MOCK_LEADERS = [
  { name: "ElonFan_X", profit: "+1,240%", asset: "$12.4M", avatar: "🚀", tag: "TSLA All-in" },
  { name: "Satoshi_Naka", profit: "+890%", asset: "$45.2M", avatar: "🐳", tag: "BTC Whale" },
  { name: "ForexQueen", profit: "+45%", asset: "$850K", avatar: "💃", tag: "Day Trader" },
  { name: "GoldFinger", profit: "+22%", asset: "$3.2M", avatar: "🥇", tag: "Commodities" },
  { name: "AI_Sniper", profit: "+188%", asset: "$5.1M", avatar: "🤖", tag: "Algo Trading" },
]

const CHAT_CHANNELS = [
  { name: "美股核心群", active: 420, icon: "🇺🇸" },
  { name: "加密货币大户", active: 890, icon: "₿" },
  { name: "外汇/黄金", active: 150, icon: "💱" },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // 上传状态
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('') 
  const [isDragging, setIsDragging] = useState(false)
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
          .from('profiles')
          .select('is_verified')
          .eq('id', user.id)
          .single()
        
        if (profile) setIsVerified(profile.is_verified)
      } catch (e) { console.log('No profile') }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // 交互
  const handleVipClick = () => alert('🚀 正在连接加密通道...\n\n您是尊贵的创始会员，专属通道将在 24h 内开启。')
  
  // 上传逻辑
  const processUpload = async (file: File) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('图片太大了，请上传小于 5MB 的图片')
      return
    }
    setUploading(true)
    setUploadStatus('')
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('proofs').upload(fileName, file)
      if (error) throw error
      setUploadStatus('success')
      alert('已加密上传！审核团队正在处理。')
    } catch (error: any) {
      setUploadStatus('error')
      alert('上传失败: ' + error.message)
    } finally {
      setUploading(false)
      setIsDragging(false)
    }
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processUpload(e.target.files[0])
  }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processUpload(e.dataTransfer.files[0])
  }
  const triggerClick = () => fileInputRef.current?.click()

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-green-500 font-mono">LOADING SYSTEM...</div>

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-green-500 selection:text-black">
      {/* 顶部导航 - 像 App 一样简洁 */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter text-white">
            BULL<span className="text-green-500">DATE</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isVerified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
              <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
              {isVerified ? '已实名认证' : '游客身份'}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center text-sm">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区 */}
      <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        
        {/* 未验证视图：聚焦于“渴望感” */}
        {!isVerified && (
          <div className="max-w-2xl mx-auto text-center mt-10">
            <div className="inline-block p-4 rounded-full bg-gray-900/50 mb-6 border border-gray-800">
              <span className="text-4xl">🔒</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              解锁 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">顶级交易圈</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              BullDate 不对公众开放。我们只接纳真正的资本玩家。<br/>
              上传你的持仓证明，获得入场券。
            </p>

            {/* 上传卡片 - 极简毛玻璃风格 */}
            <div 
              onClick={triggerClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300
                ${isDragging ? 'border-green-500 bg-green-500/10 scale-[1.02]' : 'border-gray-700 hover:border-green-500/50 hover:bg-gray-900'}
                ${uploadStatus === 'success' ? 'border-green-500 bg-green-900/20' : ''}
              `}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*"/>
              
              <div className="p-12 flex flex-col items-center justify-center">
                {uploading ? (
                  <div className="text-green-500 font-mono animate-pulse">ENCRYPTING & UPLOADING...</div>
                ) : uploadStatus === 'success' ? (
                  <>
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-bold text-green-500">提交成功</h3>
                    <p className="text-gray-500 mt-2">请留意邮箱通知</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition shadow-xl">
                      📤
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">点击或拖拽上传截图</h3>
                    <p className="text-sm text-gray-500">支持 JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-600 font-mono">SECURITY: END-TO-END ENCRYPTED</p>
          </div>
        )}

        {/* 已验证视图：社交 + 信息流风格 */}
        {isVerified && (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* 左侧栏：个人资产卡 & 频道 (占 4 列) */}
            <div className="lg:col-span-4 space-y-6">
              {/* 黑卡风格的个人信息 */}
              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Total Asset</p>
                      <h2 className="text-3xl font-bold text-white mt-1">$2,450,000<span className="text-gray-600 text-lg">.00</span></h2>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                      💳
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20 font-bold">
                      Verified Pro
                    </div>
                    <div className="text-xs text-gray-500 font-mono">ID: {user.email?.split('@')[0]}</div>
                  </div>
                </div>
              </div>

              {/* 聊天频道列表 */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-2">
                {CHAT_CHANNELS.map((channel, i) => (
                  <button key={i} onClick={handleVipClick} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition group text-left">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl grayscale group-hover:grayscale-0 transition">{channel.icon}</span>
                      <div>
                        <div className="font-bold text-gray-200 group-hover:text-white">{channel.name}</div>
                        <div className="text-xs text-gray-600 group-hover:text-green-500">{channel.active} 人在线</div>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧栏：大户动态流 (占 8 列) */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">🔥 热门交易员</h3>
                <button className="text-sm text-green-500 hover:text-green-400 font-medium">查看全部</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {MOCK_LEADERS.map((leader, index) => (
                  <div key={index} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-5 hover:border-green-500/30 transition group cursor-pointer" onClick={handleVipClick}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl border border-gray-700">
                          {leader.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-green-400 transition">{leader.name}</div>
                          <div className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-md inline-block mt-1">{leader.tag}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-500">{leader.profit}</div>
                        <div className="text-xs text-gray-500 font-mono">收益率</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full rounded-full" style={{width: `${Math.random() * 40 + 60}%`}}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                      <span>验证资产: {leader.asset}</span>
                      <span>刚刚活跃</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}