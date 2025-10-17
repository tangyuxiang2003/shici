<template>
  <!-- 悬浮按钮 -->
  <div 
    v-if="!isOpen"
    class="chat-assistant-button"
    @click="openChat"
    :style="buttonStyle"
  >
    <el-icon class="chat-icon"><ChatDotRound /></el-icon>
    <span class="chat-label">AI助手</span>
  </div>

  <!-- 聊天窗口 -->
  <div v-if="isOpen" class="chat-window" :style="windowStyle">
    <!-- 标题栏 -->
    <div class="chat-header">
      <div class="chat-title">
        <el-icon><ChatDotRound /></el-icon>
        <span>诗词AI助手</span>
      </div>
      <div class="chat-actions">
        <el-button 
          type="text" 
          :icon="Minus" 
          @click="minimizeChat"
          size="small"
        />
        <el-button 
          type="text" 
          :icon="Close" 
          @click="closeChat"
          size="small"
        />
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-avatar">
          <el-avatar 
            :size="32"
            :src="message.type === 'user' ? userAvatar : botAvatar"
          />
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.content)"></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="message bot">
        <div class="message-avatar">
          <el-avatar :size="32" :src="botAvatar" />
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="quick-actions">
        <el-button 
          v-for="action in quickActions" 
          :key="action.text"
          type="primary" 
          size="small"
          @click="sendQuickMessage(action.text)"
          :icon="action.icon"
        >
          {{ action.label }}
        </el-button>
      </div>
      
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        >
          <template #append>
            <el-button 
              :icon="Search" 
              @click="sendMessage"
              :loading="isLoading"
              type="primary"
            >
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ChatDotRound, 
  Minus, 
  Close, 
  Search,
  Star,
  User,
  Notebook
} from '@element-plus/icons-vue'
import aiAssistantService from '../api/aiAssistant.js'

// 响应式数据
const isOpen = ref(false)
const isMinimized = ref(false)
const isLoading = ref(false)
const inputMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)

// 用户和机器人头像
const userAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
const botAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=ai'

// 快速操作
const quickActions = ref([
  {
    label: '推荐诗词',
    text: '推荐一些经典唐诗',
    icon: Star
  },
  {
    label: '诗人介绍',
    text: '介绍一下李白',
    icon: User
  },
  {
    label: '月亮诗词',
    text: '有哪些描写月亮的诗词？',
    icon: Notebook
  }
])

// 位置样式
const buttonStyle = computed(() => ({
  right: '20px',
  bottom: '20px'
}))

const windowStyle = computed(() => ({
  right: '20px',
  bottom: '20px',
  width: isMinimized.value ? '300px' : '400px',
  height: isMinimized.value ? '60px' : '500px'
}))

// 方法
const openChat = () => {
  isOpen.value = true
  isMinimized.value = false
  
  // 如果没有消息，添加欢迎消息
  if (messages.value.length === 0) {
    addMessage('bot', '您好！我是诗词AI助手，可以帮助您了解诗词、诗人、朝代等相关知识。请问有什么可以帮您的？')
  }
}

const closeChat = () => {
  isOpen.value = false
}

const minimizeChat = () => {
  isMinimized.value = !isMinimized.value
}

const sendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return
  
  // 添加用户消息
  addMessage('user', message)
  inputMessage.value = ''
  
  // 显示加载状态
  isLoading.value = true
  
  try {
    // 模拟AI回复（实际应该调用API）
    await simulateAIResponse(message)
  } catch (error) {
    console.error('AI回复失败:', error)
    addMessage('bot', '抱歉，我暂时无法回答这个问题。请稍后再试或尝试其他问题。')
  } finally {
    isLoading.value = false
  }
}

const sendQuickMessage = (text) => {
  inputMessage.value = text
  sendMessage()
}

const addMessage = (type, content) => {
  messages.value.push({
    type,
    content,
    timestamp: new Date()
  })
  
  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const simulateAIResponse = async (userMessage) => {
  try {
    // 调用真实的AI助手服务（现在连接到n8n webhook）
    const response = await aiAssistantService.sendMessage(userMessage, {
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    })
    addMessage('bot', response)
  } catch (error) {
    console.error('AI回复失败:', error)
    // 显示更详细的错误信息
    addMessage('bot', '抱歉，AI服务暂时无法响应。已切换到本地智能回复模式，请稍后再试。')
  }
}

const formatMessage = (content) => {
  // 简单的格式化处理
  return content.replace(/\n/g, '<br>')
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  // 可以在这里初始化一些数据
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
.chat-assistant-button {
  position: fixed;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  user-select: none;
}

.chat-assistant-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.chat-icon {
  font-size: 18px;
}

.chat-label {
  font-weight: 500;
}

.chat-window {
  position: fixed;
  z-index: 1001;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.chat-actions {
  display: flex;
  gap: 4px;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  max-height: 400px;
  background: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: #667eea;
  color: white;
}

.message-text {
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.chat-input-area {
  border-top: 1px solid #e0e0e0;
  background: white;
}

.quick-actions {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.input-container {
  padding: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-window {
    width: 100% !important;
    height: 100% !important;
    right: 0 !important;
    bottom: 0 !important;
    border-radius: 0;
  }
  
  .chat-messages {
    max-height: none;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .quick-actions {
    justify-content: center;
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>