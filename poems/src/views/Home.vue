<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">诗词赏析</h1>
        <p class="hero-subtitle">探索千年文化瑰宝，品味诗词之美</p>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalPoems }}</span>
            <span class="stat-label">首诗词</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalAuthors }}</span>
            <span class="stat-label">位诗人</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalDynasties }}</span>
            <span class="stat-label">个朝代</span>
          </div>
        </div>
        
        <SearchBox 
          v-model="searchKeyword"
          placeholder="搜索诗词、诗人、朝代..."
          @search="handleSearch"
          @suggestion-select="handleSuggestionSelect"
          class="hero-search"
        />
      </div>
    </div>

    <!-- 快速导航 -->
    <div class="quick-nav">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="nav in quickNavs" :key="nav.id">
          <div class="nav-card" @click="handleNavClick(nav)">
            <el-icon class="nav-icon" :size="32">
              <component :is="nav.icon" />
            </el-icon>
            <span class="nav-title">{{ nav.title }}</span>
            <span class="nav-desc">{{ nav.desc }}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 阅读全文模态框 -->
    <el-dialog 
      v-model="readDialogVisible" 
      :title="currentPoem ? `《${currentPoem.title}》 - ${currentPoem.author}` : ''"
      width="600px"
      :before-close="handleCloseReadDialog"
    >
      <div v-if="currentPoem" class="poem-content">
        <div class="poem-title">{{ currentPoem.title }}</div>
        <div class="poem-author">{{ currentPoem.author }} · {{ currentPoem.dynasty }}</div>
        <div class="poem-text">{{ currentPoem.content }}</div>
      </div>
      <template #footer>
        <el-button @click="handleCloseReadDialog">关闭</el-button>
        <el-button type="primary" @click="viewPoemDetail(currentPoem)">查看详情</el-button>
      </template>
    </el-dialog>

    <!-- 诗词列表 -->
    <div class="poems-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon><StarFilled /></el-icon>
          精选推荐
        </h2>
        <div class="section-actions">
          <el-button-group>
            <el-button 
              :type="sortType === 'views' ? 'primary' : ''"
              @click="changeSort('views')"
            >
              热门
            </el-button>
            <el-button 
              :type="sortType === 'likes' ? 'primary' : ''"
              @click="changeSort('likes')"
            >
              点赞
            </el-button>
            <el-button 
              :type="sortType === 'latest' ? 'primary' : ''"
              @click="changeSort('latest')"
            >
              最新
            </el-button>
          </el-button-group>
          <el-button 
            :icon="Refresh" 
            @click="refreshPoems"
            :loading="loading"
          >
            刷新
          </el-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <!-- 诗词网格 -->
      <div v-else class="poems-grid">
        <PoemCard 
          v-for="poem in poems"
          :key="poem.id"
          :poem="poem"
          :is-favorite="isFavorite(poem)"
          @favorite-toggle="toggleFavorite"
          @view-detail="viewPoemDetail"
          @read-full="readFullPoem"
        >
          <template #header-actions>
            <el-button 
              :icon="Share" 
              @click.stop="sharePoem(poem)"
              type="text"
              size="small"
            />
          </template>
          
          <template #footer-actions>
            <el-button 
              type="primary" 
              size="small"
              @click.stop="readFullPoem(poem)"
            >
              阅读全文
            </el-button>
            <el-button 
              type="default" 
              size="small"
              @click.stop="viewPoemDetail(poem)"
            >
              查看详情
            </el-button>
          </template>
        </PoemCard>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && poems.length === 0" class="empty-state">
        <el-empty description="暂无诗词数据" />
      </div>

      <!-- 分页 -->
      <div v-if="poems.length > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'
import { poemApi } from '../utils/supabase'
import { ElMessage } from 'element-plus'
import { 
  Refresh, 
  Share, 
  StarFilled,
  Notebook,
  UserFilled,
  Histogram
} from '@element-plus/icons-vue'
import SearchBox from '../components/SearchBox.vue'
import PoemCard from '../components/PoemCard.vue'

const router = useRouter()
const poemStore = usePoemStore()

// 响应式数据
const searchKeyword = ref('')
const poems = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const sortType = ref('views')
const readDialogVisible = ref(false)
const currentPoem = ref(null)

// 统计数据
const totalPoems = ref(1560)
const totalAuthors = ref(289)
const totalDynasties = ref(12)

// 快速导航
const quickNavs = ref([
  {
    id: 1,
    title: '唐诗三百首',
    desc: '经典唐诗精选',
    icon: 'Notebook',
    route: '/poems?dynasty=唐代'
  },
  {
    id: 2,
    title: '宋词精选',
    desc: '婉约豪放并存',
    icon: 'Notebook',
    route: '/poems?dynasty=宋代'
  },
  {
    id: 3,
    title: '诗人名录',
    desc: '历代诗人介绍',
    icon: 'UserFilled',
    route: '/authors'
  },
  {
    id: 4,
    title: '诗词分类',
    desc: '按主题分类浏览',
    icon: 'Histogram',
    route: '/poems?category=all'
  }
])

// 计算属性
const paginationParams = computed(() => ({
  page: currentPage.value,
  limit: pageSize.value,
  keyword: searchKeyword.value
}))

// 方法
const fetchPoems = async () => {
  loading.value = true
  try {
    // 使用真实的Supabase API
    let apiCall
    if (searchKeyword.value.trim()) {
      // 如果有搜索关键词，使用搜索API
      apiCall = poemApi.searchPoems(searchKeyword.value, {
        page: currentPage.value,
        pageSize: pageSize.value
      })
    } else {
      // 如果没有搜索关键词，使用普通获取API
      apiCall = poemApi.getPoems({
        page: currentPage.value,
        pageSize: pageSize.value
      })
    }
    
    const { data, error } = await apiCall
    
    if (error) {
      throw error
    }
    
    if (data) {
      // 根据排序类型排序
      let sortedPoems = [...data]
      if (sortType.value === 'views') {
        sortedPoems.sort((a, b) => b.views - a.views)
      } else if (sortType.value === 'likes') {
        sortedPoems.sort((a, b) => b.likes_count - a.likes_count)
      } else if (sortType.value === 'latest') {
        sortedPoems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      
      poems.value = sortedPoems
      total.value = sortedPoems.length
    }
    
  } catch (error) {
    console.error('获取诗词列表失败:', error)
    ElMessage.error('获取诗词列表失败')
  } finally {
    loading.value = false
  }
}

const changeSort = (type) => {
  sortType.value = type
  fetchPoems()
}

const handleNavClick = (nav) => {
  router.push(nav.route)
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  currentPage.value = 1
  fetchPoems()
}

const handleSuggestionSelect = (suggestion) => {
  console.log('选择建议:', suggestion)
  // 可以根据建议类型进行不同的处理
}

const toggleFavorite = async (poem) => {
  try {
    // 调用API进行收藏/取消收藏操作
    if (poemStore.isFavorite(poem)) {
      // await poemApi.uncollectPoem(poem.id)
      poemStore.toggleFavorite(poem)
      ElMessage.success('已取消收藏')
    } else {
      // await poemApi.collectPoem(poem.id)
      poemStore.toggleFavorite(poem)
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const viewPoemDetail = (poem) => {
  router.push(`/poems/${poem.id}`)
}

const readFullPoem = (poem) => {
  currentPoem.value = poem
  readDialogVisible.value = true
}

const handleCloseReadDialog = () => {
  readDialogVisible.value = false
  currentPoem.value = null
}

const sharePoem = (poem) => {
  ElMessage.info(`分享《${poem.title}》`)
  // 这里可以实现分享功能
}

const refreshPoems = () => {
  fetchPoems()
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  fetchPoems()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchPoems()
}

const isFavorite = (poem) => {
  return poemStore.isFavorite(poem)
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const { data: poemsData } = await poemApi.getPoems({ pageSize: 1000 })
    const authorsData = await poemApi.getAuthors()
    
    if (poemsData) {
      totalPoems.value = poemsData.length
      
      // 计算不同朝代数量
      const dynasties = new Set(poemsData.map(poem => poem.dynasty))
      totalDynasties.value = dynasties.size
    }
    
    if (authorsData) {
      totalAuthors.value = authorsData.length
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 生命周期
onMounted(() => {
  fetchPoems()
  fetchStatistics()
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin-bottom: 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 60px 20px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.hero-search {
  max-width: 600px;
  margin: 0 auto;
}

/* 快速导航 */
.quick-nav {
  margin-bottom: 40px;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.nav-icon {
  color: #667eea;
  margin-bottom: 12px;
}

.nav-title {
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.nav-desc {
  font-size: 0.9rem;
  color: #666;
}

/* 诗词列表 */
.poems-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.loading-container {
  padding: 60px 0;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 阅读全文模态框样式 */
.poem-content {
  text-align: center;
  padding: 20px;
}

.poem-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 16px;
}

.poem-author {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 32px;
  font-style: italic;
}

.poem-text {
  font-size: 1.2rem;
  line-height: 2;
  color: #34495e;
  white-space: pre-line;
  text-align: left;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-page {
    padding: 10px;
  }
  
  .hero-content {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .quick-nav .el-col {
    margin-bottom: 16px;
  }
  
  .poems-section {
    padding: 20px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .section-actions {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .stat-number {
    font-size: 1.8rem;
    margin-bottom: 0;
  }
  
  .poem-title {
    font-size: 1.6rem;
  }
  
  .poem-text {
    font-size: 1.1rem;
    padding: 16px;
  }
}
</style>