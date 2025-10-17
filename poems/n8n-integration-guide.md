# n8n集成指南 - 诗词AI助手

## 概述
本文档详细说明如何将诗词AI助手与n8n工作流平台集成，实现智能对话功能。

## 集成架构

```
前端应用 (Vue.js) → n8n Webhook → AI处理 → 数据库查询 → 响应格式化 → 前端展示
```

## Webhook配置

### 基本配置
- **URL**: `http://localhost:8765/webhook/chat-handler`
- **方法**: POST
- **内容类型**: application/json

### 请求格式
```json
{
  "message": "用户输入的问题",
  "context": {
    "page": "当前页面路径",
    "timestamp": "请求时间戳",
    "userAgent": "用户代理信息",
    "language": "用户语言"
  }
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "response": "AI生成的回复内容",
    "suggestions": ["相关建议1", "相关建议2"]
  },
  "timestamp": "响应时间戳"
}
```

## n8n工作流设置

### 1. 创建工作流
1. 打开n8n界面
2. 点击"创建工作流"
3. 命名为"诗词AI助手"

### 2. 添加Webhook触发器
1. 添加"Webhook"节点
2. 配置路径: `webhook/chat-handler`
3. 方法: POST
4. 响应模式: 响应节点

### 3. 数据处理节点
建议添加以下节点处理逻辑：

#### 数据验证节点
```javascript
// 验证请求数据
const { message, context } = $input.first().json;

if (!message || typeof message !== 'string') {
  throw new Error('消息内容不能为空');
}

return $input.first().json;
```

#### 意图识别节点
```javascript
// 识别用户意图
const { message } = $input.first().json;
const lowerMessage = message.toLowerCase();

let intent = 'general';
const intents = {
  '推荐': 'recommendation',
  '介绍': 'introduction', 
  '李白': 'poet_li_bai',
  // ... 其他意图映射
};

for (const [keyword, intentType] of Object.entries(intents)) {
  if (lowerMessage.includes(keyword)) {
    intent = intentType;
    break;
  }
}

return { ...$input.first().json, intent };
```

#### AI处理节点
- 使用OpenAI节点或HTTP请求调用AI API
- 配置适当的提示词和模型参数

#### 响应格式化节点
```javascript
// 格式化最终响应
const aiResponse = $input.first().json;

return {
  success: true,
  data: {
    response: aiResponse.choices[0].message.content,
    suggestions: ['了解更多相关诗词', '查看诗人详细介绍']
  },
  timestamp: new Date().toISOString()
};
```

## 环境变量配置

在n8n中设置以下环境变量：

```bash
# Supabase配置（用于数据库查询）
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# AI服务配置（可选）
OPENAI_API_KEY=your_openai_key
```

## 测试方法

### 1. 使用测试脚本
```bash
node test-n8n-webhook.js
```

### 2. 使用curl测试
```bash
curl -X POST http://localhost:8765/webhook/chat-handler \
  -H "Content-Type: application/json" \
  -d '{
    "message": "推荐一些经典唐诗",
    "context": {
      "page": "/",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }'
```

### 3. 前端测试
1. 启动前端应用: `npm run dev`
2. 打开浏览器访问应用
3. 点击右下角AI助手按钮
4. 发送测试消息

## 故障排除

### 常见问题

#### Webhook连接失败
- 检查n8n服务是否运行: `npx n8n`
- 验证webhook路径是否正确
- 检查防火墙和端口设置

#### 响应格式错误
- 确保n8n工作流返回正确的JSON格式
- 验证响应包含必需的字段

#### AI服务不可用
- 系统会自动切换到本地智能回复
- 检查AI服务API密钥和配额

### 调试技巧

1. **查看n8n日志**: 在n8n界面查看工作流执行日志
2. **浏览器开发者工具**: 查看网络请求和响应
3. **测试脚本**: 使用提供的测试脚本验证连接

## 性能优化建议

1. **缓存策略**: 对常见问题设置缓存减少AI调用
2. **批量处理**: 多个相关请求可以批量处理
3. **异步处理**: 长时间任务使用队列异步处理
4. **限流控制**: 防止API滥用

## 安全考虑

1. **输入验证**: 所有用户输入都要验证和清理
2. **API保护**: 保护AI服务API密钥
3. **HTTPS**: 生产环境使用HTTPS加密
4. **访问控制**: 设置适当的权限控制

## 扩展功能

### 1. 用户会话管理
- 添加用户身份识别
- 维护对话历史上下文

### 2. 多语言支持
- 支持中英文对话
- 根据用户语言自动切换

### 3. 高级AI功能
- 图像识别（识别诗词图片）
- 语音交互支持
- 个性化推荐

---

*此文档为诗词AI助手n8n集成指南，可根据实际需求调整配置。*