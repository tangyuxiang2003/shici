// n8n webhook测试脚本
// 用于测试AI助手与n8n工作流的连接

const testWebhook = async () => {
  const webhookURL = 'http://localhost:8765/webhook/chat-handler'
  
  const testMessages = [
    '推荐一些经典唐诗',
    '介绍一下李白',
    '有哪些描写月亮的诗词？',
    '唐诗和宋词有什么区别？'
  ]

  console.log('🧪 开始测试n8n webhook连接...\n')

  for (const message of testMessages) {
    console.log(`📤 发送消息: "${message}"`)
    
    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: {
            page: '/test',
            timestamp: new Date().toISOString(),
            userAgent: 'n8n-webhook-tester',
            language: 'zh-CN'
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ 响应成功:')
        console.log('   状态:', response.status)
        console.log('   响应数据:', JSON.stringify(data, null, 2))
      } else {
        console.log('❌ 响应失败:')
        console.log('   状态:', response.status)
        console.log('   状态文本:', response.statusText)
      }
    } catch (error) {
      console.log('💥 请求失败:', error.message)
    }
    
    console.log('---\n')
    await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
  }

  console.log('🎉 测试完成！')
}

// 运行测试
testWebhook().catch(console.error)