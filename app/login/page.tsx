'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // 登录逻辑
  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('登录失败: ' + error.message)
    } else {
      setMessage('登录成功！正在跳转...')
      router.push('/dashboard') // 登录成功回首页
      router.refresh()
    }
    setLoading(false)
  }

  // 注册逻辑
  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('注册失败: ' + error.message)
    } else {
      setMessage('注册成功！请检查邮箱确认链接 (开发环境可能直接登录)')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-4 text-gray-200">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-white">
            BULL<span className="text-green-500">DATE</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">仅限高净值交易员</p>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition"
              placeholder="trader@wallstreet.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* 错误/成功提示 */}
          {message && (
            <div className={`text-sm p-3 rounded ${message.includes('失败') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
              {message}
            </div>
          )}

          {/* 按钮 */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '处理中...' : '登 录 / LOGIN'}
          </button>

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium py-3 rounded-lg transition text-sm"
          >
            新用户注册
          </button>
        </div>
      </div>
    </div>
  )
}