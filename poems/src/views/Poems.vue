<template>
  <div class="poems-page">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Notebook /></el-icon>
        诗歌库
      </h1>
      <p class="page-subtitle">探索中华诗词的博大精深，发现经典之作</p>
      
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="showAddDialog">
          添加诗歌
        </el-button>
        <el-button :icon="Download" @click="exportData">
          导出数据
        </el-button>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <el-card class="filter-card">
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="filter-item">
              <label class="filter-label">朝代</label>
              <el-select 
                v-model="filters.dynasty" 
                placeholder="选择朝代" 
                clearable
                style="width: 100%"
              >
                <el-option 
                  v-for="dynasty in dynasties" 
                  :key="dynasty" 
                  :label="dynasty" 
                  :value="dynasty"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="filter-item">
              <label class="filter-label">作者</label>
              <el-select 
                v-model="filters.author" 
                placeholder="选择作者" 
                clearable
                filterable
                style="width: 100%"
              >
                <el-option 
                  v-for="author in authors" 
                  :key="author" 
                  :label="author" 
                  :value="author"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="filter-item">
              <label class="filter-label">排序</label>
              <el-select 
                v-model="filters.sort" 
                placeholder="排序方式" 
                style="width: 100%"
              >
                <el-option label="按标题" value="title" />
                <el-option label="按作者" value="author" />
                <el-option label="按朝代" value="dynasty" />
                <el-option label="按浏览量" value="views" />
              </el-select>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="filter-item">
              <label class="filter-label">&nbsp;</label>
              <el-button 
                type="primary" 
                :icon="Search" 
                @click="handleSearch"
                style="width: 100%"
              >
                搜索
              </el-button>
            </div>
          </el-col>
        </el-row>
        
        <div class="search-section">
          <el-input
            v-model="searchText"
            placeholder="搜索诗歌标题、内容或作者..."
            size="large"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </el-card>

    <!-- 显示模式切换 -->
    <div class="view-mode">
      <el-radio-group v-model="viewMode" size="large">
        <el-radio-button label="card">
          <el-icon><Grid /></el-icon>
          卡片视图
        </el-radio-button>
        <el-radio-button label="table">
          <el-icon><List /></el-icon>
          列表视图
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" class="poems-grid">
      <PoemCard 
        v-for="poem in filteredPoems"
        :key="poem.id"
        :poem="poem"
        :is-favorite="isFavorite(poem)"
        @favorite-toggle="toggleFavorite"
        @view-detail="viewPoemDetail"
        @read-full="readFullPoem"
      />
    </div>

    <!-- 表格视图 -->
    <div v-else class="poems-table">
      <el-card>
        <el-table 
          :data="filteredPoems" 
          style="width: 100%"
          stripe
          v-loading="loading"
        >
          <el-table-column prop="title" label="标题" width="180">
            <template #default="scope">
              <span class="poem-title">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" width="120">
            <template #default="scope">
              <div class="author-cell">
                <el-avatar :size="24" :src="getAuthorAvatar(scope.row.author)">
                  {{ scope.row.author.charAt(0) }}
                </el-avatar>
                <span>{{ scope.row.author }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dynasty" label="朝代" width="100">
            <template #default="scope">
              <el-tag :type="getDynastyTagType(scope.row.dynasty)" size="small">
                {{ scope.row.dynasty }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="views" label="浏览量" width="100" sortable>
            <template #default="scope">
              <span class="views-count">{{ scope.row.views || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="likes_count" label="点赞" width="80" sortable>
            <template #default="scope">
              <span class="likes-count">{{ scope.row.likes_count || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button 
                link 
                type="primary" 
                size="small"
                @click="viewPoemDetail(scope.row)"
              >
                查看
              </el-button>
              <el-button 
                link 
                type="success" 
                size="small"
                @click="editPoem(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                link 
                type="danger" 
                size="small"
                @click="deletePoem(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
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
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredPoems.length === 0 && !loading" class="empty-state">
      <el-empty description="暂无诗歌数据">
        <el-button type="primary" @click="showAddDialog">添加第一首诗歌</el-button>
      </el-empty>
    </div>
  </div>

  <!-- 添加诗歌对话框 -->
  <el-dialog
    v-model="addDialogVisible"
    title="添加诗歌"
    width="600px"
    :before-close="handleAddDialogClose"
  >
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addFormRules"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="addForm.title"
          placeholder="请输入诗歌标题"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="addForm.author"
          placeholder="请输入作者姓名"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item label="朝代" prop="dynasty">
        <el-select
          v-model="addForm.dynasty"
          placeholder="请选择朝代"
          style="width: 100%"
        >
          <el-option label="唐代" value="唐代" />
          <el-option label="宋代" value="宋代" />
          <el-option label="元代" value="元代" />
          <el-option label="明代" value="明代" />
          <el-option label="清代" value="清代" />
          <el-option label="现代" value="现代" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="addForm.content"
          type="textarea"
          :rows="6"
          placeholder="请输入诗歌内容"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleAddDialogClose">取消</el-button>
        <el-button type="primary" @click="handleAddPoem" :loading="addLoading">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoemStore } from '../stores/poemStore'
import { poemApi } from '../utils/supabase'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Plus, 
  Download,
  Notebook,
  Grid,
  List
} from '@element-plus/icons-vue'
import PoemCard from '../components/PoemCard.vue'

const poemStore = usePoemStore()
const router = useRouter()

// 响应式数据
const searchText = ref('')
const viewMode = ref('card')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 添加诗歌相关
const addDialogVisible = ref(false)
const addLoading = ref(false)
const addFormRef = ref()
const addForm = ref({
  title: '',
  author: '',
  dynasty: '',
  content: ''
})

// 表单验证规则
const addFormRules = {
  title: [
    { required: true, message: '请输入诗歌标题', trigger: 'blur' },
    { min: 1, max: 50, message: '标题长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者姓名', trigger: 'blur' },
    { min: 1, max: 20, message: '作者姓名长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  dynasty: [
    { required: true, message: '请选择朝代', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入诗歌内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '内容长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 筛选条件
const filters = ref({
  dynasty: '',
  author: '',
  sort: 'title'
})

// 使用store中的数据
const poems = computed(() => poemStore.poems)

// 计算属性
const dynasties = ref([])
const authors = ref([])

const filteredPoems = computed(() => {
  if (!searchText.value.trim()) {
    return poems.value
  }
  
  const keyword = searchText.value.toLowerCase().trim()
  return poems.value.filter(poem => 
    poem.title.toLowerCase().includes(keyword) ||
    poem.author.toLowerCase().includes(keyword) ||
    poem.content.toLowerCase().includes(keyword) ||
    poem.dynasty.toLowerCase().includes(keyword)
  )
})

// 方法
const handleSearch = async () => {
  try {
    loading.value = true
    if (searchText.value) {
      await poemStore.searchPoems(searchText.value, {
        page: currentPage.value,
        pageSize: pageSize.value
      })
    } else {
      await poemStore.getPoems({
        page: currentPage.value,
        pageSize: pageSize.value,
        dynasty: filters.value.dynasty,
        author: filters.value.author
      })
    }
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  addDialogVisible.value = true
}

const handleAddDialogClose = () => {
  addDialogVisible.value = false
  addFormRef.value?.resetFields()
  addForm.value = {
    title: '',
    author: '',
    dynasty: '',
    content: ''
  }
}

const handleAddPoem = async () => {
  try {
    // 表单验证
    await addFormRef.value.validate()
    
    addLoading.value = true
    
    // 调用API添加诗歌
    const newPoem = await poemApi.addPoem(addForm.value)
    
    // 添加到本地数据
    poemStore.poems.unshift(newPoem)
    
    ElMessage.success('诗歌添加成功！')
    handleAddDialogClose()
    
    // 重新加载数据以确保数据同步
    await poemStore.getPoems({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
  } catch (error) {
    console.error('添加诗歌失败:', error)
    ElMessage.error('添加诗歌失败，请重试')
  } finally {
    addLoading.value = false
  }
}

const loadFilterOptions = async () => {
  try {
    dynasties.value = await poemStore.getDynasties()
    authors.value = await poemStore.getAuthors()
  } catch (error) {
    console.error('加载筛选选项失败:', error)
  }
}

const exportData = () => {
  ElMessage.success('数据导出功能开发中...')
}

const viewPoemDetail = (poem) => {
  router.push(`/poems/${poem.id}`)
}

const readFullPoem = (poem) => {
  ElMessage.info(`阅读《${poem.title}》全文`)
}

const editPoem = (poem) => {
  ElMessage.info(`编辑诗歌: ${poem.title}`)
}

const deletePoem = async (poem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除诗歌《${poem.title}》吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.info('删除功能需要后端API支持')
  } catch (error) {
    // 用户取消删除
  }
}

const toggleFavorite = (poem) => {
  poemStore.toggleFavorite(poem)
  ElMessage.success(poemStore.isFavorite(poem) ? '收藏成功' : '取消收藏')
}

const isFavorite = (poem) => {
  return poemStore.isFavorite(poem)
}

const getAuthorAvatar = (author) => {
  const avatars = {
    '李白': '/avatars/libai.jpg',
    '孟浩然': '/avatars/menghaoran.jpg',
    '王之涣': '/avatars/wangzhihuan.jpg',
    '王维': '/avatars/wangwei.jpg',
    '苏轼': '/avatars/sushi.jpg'
  }
  return avatars[author] || ''
}

const getDynastyTagType = (dynasty) => {
  const types = {
    '唐代': 'primary',
    '宋代': 'success',
    '元代': 'warning',
    '明代': 'info',
    '清代': 'danger'
  }
  return types[dynasty] || 'info'
}

const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 生命周期
onMounted(async () => {
  try {
    loading.value = true
    await poemStore.getPoems({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    await loadFilterOptions()
    poemStore.initFavorites()
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.poems-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 0;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.filter-section {
  padding: 20px;
}

.filter-item {
  margin-bottom: 16px;
}

.filter-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.search-section {
  margin-top: 20px;
}

.view-mode {
  text-align: center;
  margin-bottom: 24px;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.poems-table {
  margin-bottom: 24px;
}

.poem-title {
  font-weight: 600;
  color: #2c3e50;
}

.author-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.views-count,
.likes-count {
  font-weight: 600;
  color: #667eea;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 20px 0;
}

.empty-state {
  padding: 80px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .poems-page {
    padding: 10px;
  }
  
  .page-header {
    padding: 30px 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-section {
    padding: 16px;
  }
  
  .poems-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .author-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .filter-item {
    margin-bottom: 12px;
  }
}
</style>