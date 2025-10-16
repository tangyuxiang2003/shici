<template>
  <div class="poem-detail-page" v-if="poem">
    <!-- 返回按钮 -->
    <div class="back-section">
      <el-button :icon="ArrowLeft" @click="goBack" type="text">
        返回
      </el-button>
    </div>

    <!-- 诗词详情卡片 -->
    <el-card class="poem-detail-card">
      <template #header>
        <div class="poem-header">
          <h1 class="poem-title">{{ poem.title }}</h1>
          <div class="poem-meta">
            <div class="author-info">
              <el-avatar :size="48" :src="getAuthorAvatar(poem.author)">
                {{ poem.author.charAt(0) }}
              </el-avatar>
              <div class="author-details">
                <span class="author-name">{{ poem.author }}</span>
                <span class="dynasty">{{ poem.dynasty }}</span>
              </div>
            </div>
            <div class="poem-stats">
              <div class="stat-item">
                <el-icon><View /></el-icon>
                <span>{{ formatNumber(poem.views || 0) }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ formatNumber(poem.likes_count || 0) }}</span>
              </div>
              <div class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ formatNumber(poem.comments_count || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 诗词内容 -->
      <div class="poem-content">
        <div class="content-text" v-html="formatPoemContent(poem.content)"></div>
        
        <!-- 诗词解析 -->
        <div v-if="poem.analysis" class="poem-analysis">
          <h3>诗词解析</h3>
          <p>{{ poem.analysis }}</p>
        </div>

        <!-- 创作背景 -->
        <div v-if="poem.background" class="poem-background">
          <h3>创作背景</h3>
          <p>{{ poem.background }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="poem-actions">
        <el-button 
          :type="isFavorite ? 'warning' : ''" 
          :icon="isFavorite ? 'StarFilled' : 'Star'"
          @click="toggleFavorite"
        >
          {{ isFavorite ? '已收藏' : '收藏' }}
        </el-button>
        <el-button :icon="Share" @click="sharePoem">
          分享
        </el-button>
        <el-button :icon="Download" @click="downloadPoem">
          下载
        </el-button>
        <el-button :icon="Printer" @click="printPoem">
          打印
        </el-button>
      </div>

      <!-- 标签 -->
      <div v-if="poem.tags && poem.tags.length > 0" class="poem-tags">
        <el-tag 
          v-for="tag in poem.tags" 
          :key="tag"
          type="info"
          size="large"
        >
          {{ tag }}
        </el-tag>
      </div>
    </el-card>

    <!-- 相关推荐 -->
    <div class="related-poems">
      <h2>相关推荐</h2>
      <div class="related-grid">
        <PoemCard 
          v-for="relatedPoem in relatedPoems"
          :key="relatedPoem.id"
          :poem="relatedPoem"
          :is-favorite="isFavorite(relatedPoem)"
          @favorite-toggle="toggleFavorite"
          @view-detail="viewPoemDetail"
          @read-full="readFullPoem"
        />
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else-if="loading" class="loading-container">
    <el-skeleton :rows="10" animated />
  </div>

  <!-- 404状态 -->
  <div v-else class="not-found">
    <el-empty description="诗词不存在">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  View, 
  Star, 
  StarFilled,
  Share, 
  Download,
  Printer,
  ChatDotRound
} from '@element-plus/icons-vue'
import PoemCard from '../components/PoemCard.vue'

const route = useRoute()
const router = useRouter()
const poemStore = usePoemStore()

const poem = ref(null)
const loading = ref(true)
const relatedPoems = ref([])

// 计算属性
const isFavorite = computed(() => {
  return poem.value ? poemStore.isFavorite(poem.value) : false
})

// 方法
const fetchPoemDetail = async () => {
  loading.value = true
  try {
    const poemId = route.params.id
    // 调用真实的Supabase API获取诗词详情
    poem.value = await poemStore.getPoemDetail(poemId)
    
    if (poem.value) {
      // 获取相关推荐（同一朝代的诗词）
      const relatedResult = await poemStore.getPoems({
        dynasty: poem.value.dynasty,
        pageSize: 3
      })
      relatedPoems.value = relatedResult.data.filter(p => p.id !== parseInt(poemId))
    }
    
  } catch (error) {
    console.error('获取诗词详情失败:', error)
    ElMessage.error('获取诗词详情失败')
  } finally {
    loading.value = false
  }
}

const formatPoemContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + '千'
  }
  return num.toString()
}

const getAuthorAvatar = (author) => {
  const avatars = {
    '李白': '/avatars/libai.jpg',
    '孟浩然': '/avatars/menghaoran.jpg'
  }
  return avatars[author] || ''
}

const toggleFavorite = () => {
  if (poem.value) {
    poemStore.toggleFavorite(poem.value)
    ElMessage.success(isFavorite.value ? '取消收藏' : '收藏成功')
  }
}

const sharePoem = () => {
  if (poem.value) {
    ElMessage.info(`分享《${poem.value.title}》`)
    // 实际项目中可以实现分享功能
  }
}

const downloadPoem = () => {
  if (poem.value) {
    ElMessage.info(`下载《${poem.value.title}》`)
    // 实际项目中可以实现下载功能
  }
}

const printPoem = () => {
  if (poem.value) {
    ElMessage.info(`打印《${poem.value.title}》`)
    // 实际项目中可以实现打印功能
  }
}

const goBack = () => {
  router.back()
}

const viewPoemDetail = (relatedPoem) => {
  router.push(`/poems/${relatedPoem.id}`)
}

const readFullPoem = (relatedPoem) => {
  ElMessage.info(`阅读《${relatedPoem.title}》全文`)
}

// 生命周期
onMounted(() => {
  fetchPoemDetail()
})
</script>

<style scoped>
.poem-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.back-section {
  margin-bottom: 20px;
}

.poem-detail-card {
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;
}

.poem-header {
  padding: 20px 0;
}

.poem-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.poem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.dynasty {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.poem-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  font-weight: 500;
}

.poem-content {
  padding: 32px 0;
}

.content-text {
  font-size: 1.4rem;
  line-height: 2;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-family: '楷体', 'STKaiti', serif;
}

.poem-analysis,
.poem-background {
  margin-top: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.poem-analysis h3,
.poem-background h3 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.poem-analysis p,
.poem-background p {
  color: #5a6c7d;
  line-height: 1.8;
  margin: 0;
}

.poem-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 32px 0;
  flex-wrap: wrap;
}

.poem-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.related-poems {
  margin-top: 40px;
}

.related-poems h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 24px;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.loading-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.not-found {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .poem-detail-page {
    padding: 10px;
  }
  
  .poem-title {
    font-size: 2rem;
  }
  
  .poem-meta {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .author-info {
    flex-direction: column;
    text-align: center;
  }
  
  .content-text {
    font-size: 1.2rem;
  }
  
  .poem-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .poem-actions .el-button {
    width: 200px;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .poem-title {
    font-size: 1.8rem;
  }
  
  .content-text {
    font-size: 1.1rem;
  }
  
  .poem-analysis,
  .poem-background {
    padding: 16px;
  }
}
</style>