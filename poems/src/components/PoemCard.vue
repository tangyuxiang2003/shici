<template>
  <div 
    :class="[
      'poem-card',
      { 'poem-card--favorite': isFavorite },
      { 'poem-card--loading': loading },
      { 'poem-card--selected': selected },
      { 'poem-card--popular': poem.views > 1000 }
    ]"
    @click="handleClick"
  >
    <!-- 热门标签 -->
    <div v-if="poem.views > 1000" class="poem-card__badge">
      <el-icon><Star /></el-icon>
      热门
    </div>
    
    <div class="poem-card__header">
      <h3 class="poem-card__title">{{ poem.title }}</h3>
      <div class="poem-card__actions">
        <el-tooltip 
          :content="isFavorite ? '取消收藏' : '收藏'" 
          placement="top"
        >
          <el-button 
            :icon="isFavorite ? 'StarFilled' : 'Star'" 
            @click.stop="toggleFavorite"
            type="text"
            :loading="favoriteLoading"
            size="small"
            :class="{ 'favorite-btn': isFavorite }"
          />
        </el-tooltip>
        <slot name="header-actions"></slot>
      </div>
    </div>
    
    <div class="poem-card__author">
      <el-avatar 
        :size="32" 
        :src="getAuthorAvatar(poem.author)"
        class="author-avatar"
      >
        {{ poem.author.charAt(0) }}
      </el-avatar>
      <div class="author-info">
        <span class="author-name">{{ poem.author }}</span>
        <span class="dynasty">{{ poem.dynasty }}</span>
      </div>
    </div>
    
    <div class="poem-card__content" @click.stop="readFull">
      {{ truncatedContent }}
      <span v-if="showReadMore" class="read-more">阅读全文</span>
    </div>
    
    <div class="poem-card__stats">
      <span class="stat-item">
        <el-icon><View /></el-icon>
        {{ formatNumber(poem.views || 0) }}
      </span>
      <span class="stat-item">
        <el-icon><Star /></el-icon>
        {{ formatNumber(poem.likes_count || 0) }}
      </span>
      <span class="stat-item">
        <el-icon><ChatDotRound /></el-icon>
        {{ formatNumber(poem.comments_count || 0) }}
      </span>
    </div>
    
    <div class="poem-card__tags" v-if="poem.tags && poem.tags.length > 0">
      <el-tag 
        v-for="tag in poem.tags.slice(0, 3)" 
        :key="tag"
        size="small"
        type="info"
      >
        {{ tag }}
      </el-tag>
      <el-tag v-if="poem.tags.length > 3" size="small" type="info">
        +{{ poem.tags.length - 3 }}
      </el-tag>
    </div>
    
    <div class="poem-card__footer">
      <slot name="actions">
        <el-button 
          size="small" 
          @click.stop="viewDetail"
          class="detail-btn"
        >
          <el-icon><Document /></el-icon>
          详情
        </el-button>
        <el-button 
          size="small" 
          type="primary" 
          @click.stop="readFull"
          class="read-btn"
        >
          <el-icon><Reading /></el-icon>
          阅读
        </el-button>
        <el-button 
          size="small" 
          @click.stop="sharePoem"
          class="share-btn"
        >
          <el-icon><Share /></el-icon>
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  View, 
  Star, 
  ChatDotRound,
  Document,
  Reading,
  Share 
} from '@element-plus/icons-vue'

const props = defineProps({
  poem: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  favoriteLoading: {
    type: Boolean,
    default: false
  },
  maxContentLength: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits([
  'favorite-toggle',
  'click', 
  'view-detail',
  'read-full',
  'share'
])

const truncatedContent = computed(() => {
  if (!props.poem.content) return ''
  
  if (props.poem.content.length <= props.maxContentLength) {
    return props.poem.content
  }
  return props.poem.content.slice(0, props.maxContentLength) + '...'
})

const showReadMore = computed(() => {
  return props.poem.content && props.poem.content.length > props.maxContentLength
})

const getAuthorAvatar = (author) => {
  // 模拟作者头像，实际项目中可以从API获取
  const avatars = {
    '李白': '/avatars/libai.jpg',
    '杜甫': '/avatars/dufu.jpg',
    '苏轼': '/avatars/sushi.jpg',
    '王维': '/avatars/wangwei.jpg'
  }
  return avatars[author] || ''
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千'
  }
  return num.toString()
}

const toggleFavorite = () => {
  if (!props.favoriteLoading) {
    emit('favorite-toggle', props.poem)
  }
}

const handleClick = () => {
  emit('click', props.poem)
}

const viewDetail = () => {
  emit('view-detail', props.poem)
}

const readFull = () => {
  emit('read-full', props.poem)
}

const sharePoem = () => {
  emit('share', props.poem)
}
</script>

<style scoped>
.poem-card {
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.poem-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: #667eea;
}

.poem-card--favorite {
  border-color: #ffd04b;
  background: linear-gradient(135deg, #fffdf6 0%, #fff9e6 100%);
}

.poem-card--loading {
  opacity: 0.6;
  pointer-events: none;
}

.poem-card--selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
}

.poem-card--popular {
  border-left: 4px solid #ff6b6b;
}

.poem-card__badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 1;
}

.poem-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.poem-card__title {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
  line-height: 1.3;
  flex: 1;
  margin-right: 12px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.poem-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn {
  color: #ffd04b !important;
}

.favorite-btn:hover {
  color: #ffc107 !important;
  transform: scale(1.1);
}

.poem-card__author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.author-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.dynasty {
  color: #7f8c8d;
  font-size: 12px;
}

.poem-card__content {
  color: #34495e;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 15px;
  cursor: pointer;
  position: relative;
}

.read-more {
  color: #667eea;
  font-weight: 500;
  margin-left: 4px;
  text-decoration: underline;
}

.poem-card__stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #7f8c8d;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

.stat-item:hover {
  color: #667eea;
}

.poem-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.poem-card__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.detail-btn,
.read-btn,
.share-btn {
  transition: all 0.3s ease;
}

.detail-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.read-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.read-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.share-btn:hover {
  color: #667eea;
  border-color: #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .poem-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .poem-card__title {
    font-size: 18px;
  }
  
  .poem-card__header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .poem-card__actions {
    justify-content: flex-end;
  }
  
  .poem-card__footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .poem-card__footer .el-button {
    width: 100%;
  }
  
  .poem-card__stats {
    gap: 16px;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .poem-card {
    padding: 12px;
  }
  
  .poem-card__title {
    font-size: 16px;
  }
  
  .poem-card__author {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .author-info {
    align-items: flex-start;
  }
}
</style>