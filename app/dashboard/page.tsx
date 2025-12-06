'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false) // 新增：是否已验证
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
      // 1. 获取当前用户
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 2. 查户口：去 profiles 表里查这个人的状态
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_verified')
          .eq('id', user.id)
          .single()
        
        // 如果查到了，更新状态
        if (profile) {
          setIsVerified(profile.is_verified)
        }
      } catch (e) {
        console.log('还没档案，可能是老用户未触发')
      }

      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // --- 上传逻辑 (完整保留) ---
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

  // 渲染开始
  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">加载数据中...</div>

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 顶部欢迎语 */}
        <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isVerified ? '尊贵的验证会员' : '交易员后台'}
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-sm">{user.email}</p>
          </div>
          
          {/* 状态标签：根据状态变色 */}
          <div className={`px-4 py-1 rounded-full text-xs font-bold border ${isVerified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
            状态: {isVerified ? '已验证 ✅' : '待验证'}
          </div>
        </div>

        {/* 核心内容区：分流显示 */}
        {isVerified ? (
          // ============ 如果已验证：显示大户室 ============
          <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-800 rounded-2xl p-10 text-center animate-fade-in">
            <div className="text-6xl mb-6">🤑</div>
            <h2 className="text-3xl font-bold text-white mb-4">欢迎进入 Alpha 俱乐部</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              你的资产已验证。这里没有韭菜，只有真正的操盘手。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-green-600 hover:bg-green-500 text-black font-bold py-4 px-8 rounded-xl transition shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                进入 VIP 聊天室
              </button>
              <button className="border border-green-700 text-green-500 hover:bg-green-900/30 font-bold py-4 px-8 rounded-xl transition">
                查看大户持仓榜
              </button>
            </div>
          </div>
        ) : (
          // ============ 如果未验证：显示上传框 ============
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