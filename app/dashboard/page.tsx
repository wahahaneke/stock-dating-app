'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('') 
  const [isDragging, setIsDragging] = useState(false) // 新增：拖拽状态
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router, supabase])

  // 核心上传逻辑（抽离出来，供点击和拖拽共用）
  const processUpload = async (file: File) => {
    if (!file) return

    // 限制文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片太大了，请上传小于 5MB 的图片')
      return
    }

    setUploading(true)
    setUploadStatus('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('proofs')
        .upload(fileName, file)

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

  // 1. 处理点击选择文件
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0])
    }
  }

  // 2. 处理拖拽进入
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // 关键！阻止浏览器打开图片
    e.stopPropagation()
    setIsDragging(true)
  }

  // 3. 处理拖拽离开
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  // 4. 处理拖拽放下
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault() // 关键！阻止浏览器打开图片
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0])
    }
  }

  // 触发点击
  const triggerClick = () => {
    fileInputRef.current?.click()
  }

  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">交易员后台</h1>
            <p className="text-gray-500 mt-2 font-mono text-sm">{user.email}</p>
          </div>
          <div className="bg-yellow-500/10 text-yellow-500 px-4 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
            状态: 待验证
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-lg transition">
            <h2 className="text-xl font-bold text-green-500 mb-4 flex items-center gap-2">
              <span className="text-2xl">📸</span> 验证你的身价
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              我们需要验证你是否真的是高净值交易者。请上传一张包含资产总额或收益率的截图。
            </p>
            
            {/* 隐藏的文件输入框 */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="image/*"
            />

            {/* 可点击 + 可拖拽的区域 */}
            <div 
              onClick={triggerClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition duration-200
                ${isDragging ? 'border-green-400 bg-green-900/20 scale-[1.02]' : 'border-gray-700 hover:bg-gray-900 hover:border-green-500'}
                ${uploadStatus === 'success' ? 'border-green-500 bg-green-900/10' : ''}
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              {uploading ? (
                <span className="text-green-500 animate-pulse">正在加密上传...</span>
              ) : uploadStatus === 'success' ? (
                <>
                  <span className="text-4xl mb-2">✅</span>
                  <span className="text-sm text-green-500">已提交，审核中</span>
                </>
              ) : (
                <>
                  <span className="text-4xl mb-2">{isDragging ? '👇' : '📤'}</span>
                  <span className="text-sm text-gray-400">
                    {isDragging ? '松开鼠标即可上传' : '点击选择图片或拖拽至此'}
                  </span>
                </>
              )}
            </div>
            
            {uploadStatus === 'success' && (
              <p className="text-center text-xs text-gray-500 mt-4">
                这也太强了！如果你通过审核，你会收到邮件通知。
              </p>
            )}
          </div>

          <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
             <h3 className="text-lg font-bold text-white mb-4">为什么需要验证？</h3>
             <p className="text-gray-400 text-sm mb-4">BullDate 是一个精英社区...</p>
             <div className="mt-6 space-y-3">
               <div className="flex items-center gap-3 text-sm text-gray-300">
                 <div className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center text-green-500">✓</div>
                 <span>解锁“大户”专属聊天室</span>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}