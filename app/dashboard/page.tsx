'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// --- 模拟数据：这是我们的“氛围组” ---
const MOCK_LEADERS = [
  { name: "TeslaKing_99", profit: "+142%", asset: "$2.4M", avatar: "⚡️" },
  { name: "CryptoWhale", profit: "+890%", asset: "$12.8M", avatar: "🐋" },
  { name: "ForexSniper", profit: "+45%", asset: "$850K", avatar: "🎯" },
  { name: "GoldHand", profit: "+22%", asset: "$3.2M", avatar: "🥇" },
  { name: "NvidiaLover", profit: "+88%", asset: "$1.1M", avatar: "🤖" },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // 上传相关状态
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
      } catch (e) {
        console.log('用户档案未找到')
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // 按钮交互
  const handleVipClick = () => {
    alert('🔥 聊天室正在扩容中！\n\n您已获得“创始会员”资格，将在功能开放后第一时间获得通知。')
  }

  // --- 上传逻辑 (保持不变) ---
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
      alert('上传成功！请耐心等待人工审核。')
    } catch (error: any) {
      console.error(error)
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
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processUpload(e.dataTransfer.files[0])
  }
  const triggerClick = () => fileInputRef.current?.click()

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">加载数据中...</div>

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 顶部欢迎语 */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {isVerified ? 'Alpha 俱乐部' : '交易员后台'}
              {isVerified && <span className="text-xs bg-green-600 text-black px-2 py-1 rounded">VIP</span>}
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-sm">
              当前在线会员: <span className="text-green-500 animate-pulse">1,024</span> 人
            </p>
          </div>
          
          <div className={`px-4 py-1 rounded-full text-xs font-bold border ${isVerified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
            ID: {user.email?.split('@')[0]} | 状态: {isVerified ? '已验证 ✅' : '待验证'}
          </div>
        </div>

        {/* 核心内容区 */}
        {isVerified ? (
          // ============ 精装修后的 VIP 区域 ============
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* 左侧：功能入口 */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-800 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-white mb-2">VIP 核心群</h2>
                <p className="text-gray-400 mb-6 text-sm">
                  正在讨论: #TSLA财报 #BTC减半 #美联储加息
                </p>
                <button 
                  onClick={handleVipClick}
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-xl transition"
                >
                  进入聊天室
                </button>
              </div>

              <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">我的专属名片</h3>
                  <p className="text-xs text-gray-500">已获得“实盘验证”金标</p>
                </div>
                <button className="text-sm text-green-500 border border-green-900 px-4 py-2 rounded-lg hover:bg-green-900/20">
                  编辑资料
                </button>
              </div>
            </div>

            {/* 右侧：排行榜 (氛围组) */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                🏆 本周收益榜
              </h3>
              <div className="space-y-4">
                {MOCK_LEADERS.map((leader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-900/50 transition cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-lg bg-gray-800 rounded-full">
                        {leader.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-200">{leader.name}</div>
                        <div className="text-xs text-gray-500">{leader.asset}</div>
                      </div>
                    </div>
                    <div className="text-green-500 font-mono font-bold">
                      {leader.profit}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-800 text-center">
                 <p className="text-xs text-gray-500">数据每 15 分钟更新</p>
              </div>
            </div>

          </div>
        ) : (
          // ============ 未验证区域 (保持不变) ============
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-lg transition">
              <h2 className="text-xl font-bold text-green-500 mb-4 flex items-center gap-2">
                <span className="text-2xl">📸</span> 验证你的身价
              </h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                你需要上传资产截图才能解锁全部功能。
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*"/>
              <div 
                onClick={triggerClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition duration-200
                  ${isDragging ? 'border-green-400 bg-green-900/20 scale-[1.02]' : 'border-gray-700 hover:bg-gray-900 hover:border-green-500'}
                  ${uploadStatus === 'success' ? 'border-green-500 bg-green-900/10' : ''}
                  ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                {uploading ? (
                  <span className="text-green-500 animate-pulse">上传中...</span>
                ) : uploadStatus === 'success' ? (
                  <>
                    <span className="text-4xl mb-2">✅</span>
                    <span className="text-sm text-green-500">已提交，审核中</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-2">{isDragging ? '👇' : '📤'}</span>
                    <span className="text-sm text-gray-400">{isDragging ? '松开' : '上传持仓截图'}</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
               <h3 className="text-lg font-bold text-white mb-4">权益说明</h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-gray-300">
                   <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-500">🔒</div>
                   <span>聊天室 (未解锁)</span>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}