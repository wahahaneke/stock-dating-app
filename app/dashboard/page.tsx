'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

// 定义帖子类型
type Post = {
  id: string
  content: string
  ticker: string
  profit_rate: number
  created_at: string
  user_id: string
  profiles: {
    email: string
    is_verified: boolean
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // 帖子数据
  const [posts, setPosts] = useState<Post[]>([])
  
  // 发帖表单状态
  const [newContent, setNewContent] = useState('')
  const [newTicker, setNewTicker] = useState('') // 股票代码
  const [newProfit, setNewProfit] = useState('') // 收益率
  const [isPosting, setIsPosting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initData = async () => {
      // 1. 获取用户
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 2. 查户口 (看是否验证)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', user.id)
        .single()
      
      if (profile?.is_verified) {
        setIsVerified(true)
      }

      // 3. 拉取所有帖子 (Feed)
      fetchPosts()
      setLoading(false)
    }
    initData()
  }, [router, supabase])

  // 拉取帖子逻辑
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (email, is_verified)
      `)
      .order('created_at', { ascending: false }) // 最新发的在最上面

    if (data) {
      // @ts-ignore
      setPosts(data)
    }
  }

  // 发布帖子逻辑
  const handlePost = async () => {
    if (!newContent) return alert('请写点什么吧')
    setIsPosting(true)

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content: newContent,
      ticker: newTicker ? newTicker.toUpperCase() : null, // 自动转大写
      profit_rate: newProfit ? parseFloat(newProfit) : null
    })

    if (error) {
      alert('发布失败: ' + error.message)
    } else {
      // 清空表单并刷新列表
      setNewContent('')
      setNewTicker('')
      setNewProfit('')
      fetchPosts() // 重新拉取
    }
    setIsPosting(false)
  }

  // 辅助：邮箱打码
  const maskEmail = (email: string) => {
    if (!email) return 'Unknown'
    const [name, domain] = email.split('@')
    return `${name.substring(0, 4)}***`
  }

  // 辅助：时间格式化
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString()
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">加载中...</div>

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100">
      <div className="max-w-2xl mx-auto border-x border-gray-800 min-h-screen">
        
        {/* 顶部导航 */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">广场</h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-xs text-gray-400">{isVerified ? 'VIP' : '游客'}</span>
          </div>
        </div>

        {/* 发帖区域 (Create Post) */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="分享你的交易逻辑..."
                className="w-full bg-transparent text-white text-lg placeholder-gray-600 outline-none resize-none h-20"
              />
              
              {/* 晒单工具栏 */}
              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex items-center bg-[#111] rounded-lg px-3 py-1 border border-gray-800 focus-within:border-green-500 transition">
                  <span className="text-gray-500 mr-1">$</span>
                  <input 
                    type="text" 
                    placeholder="TSLA" 
                    value={newTicker}
                    onChange={e => setNewTicker(e.target.value)}
                    className="bg-transparent w-16 text-sm outline-none font-mono uppercase"
                  />
                </div>
                
                <div className="flex items-center bg-[#111] rounded-lg px-3 py-1 border border-gray-800 focus-within:border-green-500 transition">
                  <span className="text-gray-500 mr-1">收益%</span>
                  <input 
                    type="number" 
                    placeholder="20.5" 
                    value={newProfit}
                    onChange={e => setNewProfit(e.target.value)}
                    className="bg-transparent w-16 text-sm outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <div className="text-green-500 text-sm cursor-pointer hover:text-green-400">
                  📸 添加图片 (开发中)
                </div>
                <button 
                  onClick={handlePost}
                  disabled={isPosting || !newContent}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-bold px-6 py-2 rounded-full text-sm transition"
                >
                  {isPosting ? '发送中...' : '发布 / Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 信息流 (The Feed) */}
        <div className="divide-y divide-gray-800">
          {posts.map(post => (
            <div key={post.id} className="p-4 hover:bg-[#0a0a0a] transition cursor-pointer">
              <div className="flex gap-3">
                {/* 头像 */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex-shrink-0 flex items-center justify-center font-bold text-gray-300">
                  {post.profiles?.email?.[0].toUpperCase() || '?'}
                </div>

                <div className="flex-1">
                  {/* 用户名栏 */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">
                      {maskEmail(post.profiles?.email)}
                    </span>
                    {post.profiles?.is_verified && (
                      <span className="bg-green-500/10 text-green-500 text-[10px] px-1.5 py-0.5 rounded font-bold border border-green-500/20">
                        VERIFIED
                      </span>
                    )}
                    <span className="text-gray-500 text-xs ml-auto">{timeAgo(post.created_at)}</span>
                  </div>

                  {/* 帖子内容 */}
                  <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{post.content}</p>

                  {/* 🔥 晒单卡片 (The Flex Card) */}
                  {(post.ticker || post.profit_rate) && (
                    <div className={`
                      inline-flex items-center gap-4 px-4 py-3 rounded-xl border mb-2
                      ${(post.profit_rate || 0) >= 0 
                        ? 'bg-green-900/10 border-green-900/50' 
                        : 'bg-red-900/10 border-red-900/50'}
                    `}>
                      {/* 股票代码 */}
                      {post.ticker && (
                        <div className="flex items-center gap-1">
                          <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400">
                            $
                          </span>
                          <span className="font-mono font-bold text-white text-lg">
                            {post.ticker}
                          </span>
                        </div>
                      )}

                      {/* 收益率 */}
                      {post.profit_rate && (
                        <div className={`text-2xl font-black font-mono tracking-tighter
                          ${post.profit_rate >= 0 ? 'text-green-500' : 'text-red-500'}
                        `}>
                          {post.profit_rate > 0 ? '+' : ''}{post.profit_rate}%
                        </div>
                      )}
                    </div>
                  )}

                  {/* 互动栏 (点赞/评论 - 装饰用) */}
                  <div className="flex gap-12 mt-2 text-gray-500 text-xs">
                    <div className="hover:text-green-500 transition flex items-center gap-1">
                      💬 <span>评论</span>
                    </div>
                    <div className="hover:text-green-500 transition flex items-center gap-1">
                      🚀 <span>顶</span>
                    </div>
                    <div className="hover:text-green-500 transition flex items-center gap-1">
                      💸 <span>打赏</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}