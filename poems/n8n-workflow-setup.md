# n8n工作流配置指南 - 诗词AI助手

## 概述
本文档指导如何设置n8n工作流来支持诗词AI助手功能。

## 工作流设计

### 工作流名称
`poem-ai-assistant`

### 触发方式
- **Webhook触发**：接收来自前端应用的HTTP请求
- **HTTP方法**：POST
- **路径**：`/webhook/poem-ai`

### 工作流节点设计

#### 1. Webhook节点（触发器）
- **节点类型**：Webhook
- **HTTP方法**：POST
- **路径**：`/webhook/poem-ai`
- **响应模式**：响应JSON

#### 2. 数据验证节点
- **节点类型**：Function
- **功能**：验证请求数据格式
- **验证字段**：
  - `message` (string, 必需)
  - `context` (object, 可选)

#### 3. 意图识别节点
- **节点类型**：Function
- **功能**：分析用户消息意图
- **识别分类**：
  - 诗词推荐
  - 诗人介绍
  - 诗词赏析
  - 朝代历史
  - 主题分类

#### 4. 数据库查询节点
- **节点类型**：Supabase
- **操作**：根据意图查询相关数据
- **查询内容**：
  - 诗词信息
  - 诗人资料
  - 朝代背景
  - 分类标签

#### 5. AI处理节点
- **节点类型**：OpenAI/ChatGPT
- **模型**：gpt-3.5-turbo 或 gpt-4
- **提示词**：基于查询结果生成自然语言回复

#### 6. 响应格式化节点
- **节点类型**：Function
- **功能**：格式化最终回复内容

#### 7. Webhook响应节点
- **节点类型**：Webhook Response
- **数据**：返回格式化后的AI回复

## 环境变量配置

在n8n中配置以下环境变量：

```bash
# Supabase配置（与前端相同）
SUPABASE_URL=https://awggamufhpmvmfyaeaat.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ

# OpenAI配置（可选）
OPENAI_API_KEY=your_openai_api_key_here

# 工作流配置
N8N_WEBHOOK_URL=http://localhost:5678/webhook/poem-ai
```

## 请求/响应格式

### 请求格式
```json
{
  "message": "推荐一些经典唐诗",
  "context": {
    "page": "/",
    "timestamp": "2024-01-01T10:00:00Z",
    "userPreferences": {}
  }
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "response": "以下是一些经典唐诗推荐：\n\n1. **《静夜思》 - 李白**\n   床前明月光，疑是地上霜。\n   举头望明月，低头思故乡。\n\n2. **《春晓》 - 孟浩然**\n   春眠不觉晓，处处闻啼鸟。\n   夜来风雨声，花落知多少。",
    "suggestions": [
      "了解更多李白作品",
      "查看唐代诗人列表",
      "搜索春天主题诗词"
    ]
  },
  "timestamp": "2024-01-01T10:00:05Z"
}
```

## 部署说明

### 本地开发
1. 启动n8n：`npx n8n`
2. 导入工作流JSON配置
3. 激活工作流
4. 测试Webhook端点

### 生产环境
1. 部署n8n到服务器
2. 配置域名和SSL证书
3. 设置环境变量
4. 导入并激活工作流

## 测试方法

### 使用curl测试
```bash
curl -X POST http://localhost:5678/webhook/poem-ai \
  -H "Content-Type: application/json" \
  -d '{
    "message": "介绍一下李白",
    "context": {
      "page": "/",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }'
```

### 使用Postman测试
1. 设置请求方法：POST
2. URL：`http://localhost:5678/webhook/poem-ai`
3. Headers：`Content-Type: application/json`
4. Body：raw JSON格式的请求数据

## 错误处理

### 常见错误码
- `400`：请求数据格式错误
- `500`：服务器内部错误
- `503`：AI服务不可用

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "消息内容不能为空",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

## 性能优化建议

1. **缓存策略**：对常见问题设置缓存
2. **限流控制**：防止API滥用
3. **异步处理**：长时间任务使用队列
4. **监控告警**：设置性能监控

## 安全考虑

1. **API密钥保护**：不要硬编码密钥
2. **输入验证**：防止注入攻击
3. **HTTPS加密**：生产环境使用SSL
4. **访问控制**：设置适当的权限

---

*此文档为诗词AI助手n8n工作流配置指南，可根据实际需求调整。*