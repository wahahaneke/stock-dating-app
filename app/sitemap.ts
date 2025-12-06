import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.png2026.top'

  // 1. 定义我们的热门资产列表 (和之前写的保持一致)
  const assets = [
    'bitcoin', 'ethereum', 'solana', 'doge', // 加密货币
    'tesla', 'nvidia', 'apple', 'gamestop',  // 股票
    'gold', 'forex', 'futures', 'crypto'     // 其他
  ]

  // 2. 生成动态页面的地图
  const meetingPages = assets.map((slug) => ({
    url: `${baseUrl}/meet/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // 3. 合并静态页面 (首页)
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...meetingPages,
  ]
}