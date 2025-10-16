<template>
  <div class="search-box">
    <div class="search-container">
      <el-input
        v-model="keyword"
        :placeholder="placeholder"
        :prefix-icon="Search"
        clearable
        @input="handleInput"
        @clear="handleClear"
        @keyup.enter="handleSearch"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        size="large"
        class="search-input"
      >
        <template #append>
          <el-button 
            :icon="Search" 
            @click="handleSearch" 
            type="primary"
            class="search-btn"
          >
            {{ searchButtonText }}
          </el-button>
        </template>
      </el-input>
      
      <!-- 热门搜索标签 -->
      <div v-if="showHotKeywords && hotKeywords.length > 0" class="hot-keywords">
        <span class="hot-label">热门搜索：</span>
        <el-tag
          v-for="hotKeyword in hotKeywords"
          :key="hotKeyword.id"
          size="small"
          type="info"
          class="hot-tag"
          @click="selectHotKeyword(hotKeyword)"
        >
          {{ hotKeyword.text }}
        </el-tag>
      </div>
    </div>
    
    <!-- 搜索建议 -->
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      class="search-suggestions"
      v-click-outside="hideSuggestions"
    >
      <div class="suggestions-header">
        <span>搜索建议</span>
        <el-button 
          link 
          type="primary" 
          size="small"
          @click="clearSuggestions"
        >
          清除
        </el-button>
      </div>
      
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion.id"
        class="suggestion-item"
        @mousedown="selectSuggestion(suggestion)"
      >
        <div class="suggestion-content">
          <el-icon class="suggestion-icon" :color="getSuggestionIconColor(suggestion.type)">
            <component :is="getSuggestionIcon(suggestion.type)" />
          </el-icon>
          <span class="suggestion-text">{{ suggestion.text }}</span>
        </div>
        <div class="suggestion-meta">
          <span class="suggestion-type">{{ getSuggestionType(suggestion.type) }}</span>
          <span v-if="suggestion.count" class="suggestion-count">
            {{ suggestion.count }} 条结果
          </span>
        </div>
      </div>
      
      <div class="suggestions-footer">
        <span>按 Enter 搜索</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { 
  Search, 
  Notebook, 
  UserFilled, 
  Histogram,
  Clock
} from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

// 点击外部指令
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索诗词、诗人、朝代...'
  },
  delay: {
    type: Number,
    default: 300
  },
  showSuggestions: {
    type: Boolean,
    default: true
  },
  showHotKeywords: {
    type: Boolean,
    default: true
  },
  suggestionTypes: {
    type: Array,
    default: () => ['poem', 'author', 'dynasty', 'tag']
  },
  searchButtonText: {
    type: String,
    default: '搜索'
  }
})

const emit = defineEmits([
  'update:modelValue', 
  'search', 
  'suggestion-select',
  'clear',
  'hot-keyword-select'
])

const keyword = ref(props.modelValue)
const suggestions = ref([])
const showSuggestions = ref(false)

// 热门搜索关键词
const hotKeywords = ref([
  { id: 1, text: '李白', type: 'author', count: 156 },
  { id: 2, text: '唐诗三百首', type: 'poem', count: 89 },
  { id: 3, text: '宋代', type: 'dynasty', count: 234 },
  { id: 4, text: '爱情', type: 'tag', count: 67 },
  { id: 5, text: '苏轼', type: 'author', count: 98 }
])

// 防抖搜索
const debouncedSearch = debounce(async (value) => {
  if (!value.trim()) {
    suggestions.value = []
    return
  }
  
  try {
    // 模拟搜索建议数据
    const mockSuggestions = [
      { 
        id: 1, 
        text: value + '的诗词', 
        type: 'poem',
        count: Math.floor(Math.random() * 100) + 50
      },
      { 
        id: 2, 
        text: value, 
        type: 'author',
        count: Math.floor(Math.random() * 50) + 20
      },
      { 
        id: 3, 
        text: value + '朝代', 
        type: 'dynasty',
        count: Math.floor(Math.random() * 30) + 10
      },
      { 
        id: 4, 
        text: value + '相关', 
        type: 'tag',
        count: Math.floor(Math.random() * 80) + 30
      }
    ]
    
    suggestions.value = mockSuggestions.filter(suggestion => 
      props.suggestionTypes.includes(suggestion.type)
    )
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    suggestions.value = []
  }
}, props.delay)

const handleInput = (value) => {
  emit('update:modelValue', value)
  if (props.showSuggestions) {
    debouncedSearch(value)
  }
}

const handleClear = () => {
  suggestions.value = []
  emit('update:modelValue', '')
  emit('clear')
}

const handleSearch = () => {
  if (keyword.value.trim()) {
    emit('search', keyword.value)
    showSuggestions.value = false
    // 添加到搜索历史（实际项目中可以持久化存储）
    addToSearchHistory(keyword.value)
  }
}

const handleBlur = () => {
  // 延迟隐藏建议框，以便点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const hideSuggestions = () => {
  showSuggestions.value = false
}

const clearSuggestions = () => {
  suggestions.value = []
}

const selectSuggestion = (suggestion) => {
  keyword.value = suggestion.text
  emit('update:modelValue', suggestion.text)
  emit('suggestion-select', suggestion)
  showSuggestions.value = false
  
  // 触发搜索
  nextTick(() => {
    handleSearch()
  })
}

const selectHotKeyword = (hotKeyword) => {
  keyword.value = hotKeyword.text
  emit('update:modelValue', hotKeyword.text)
  emit('hot-keyword-select', hotKeyword)
  showSuggestions.value = false
  
  // 触发搜索
  nextTick(() => {
    handleSearch()
  })
}

const getSuggestionType = (type) => {
  const typeMap = {
    poem: '诗词',
    author: '诗人',
    dynasty: '朝代',
    tag: '标签'
  }
  return typeMap[type] || type
}

const getSuggestionIcon = (type) => {
  const iconMap = {
    poem: Notebook,
    author: UserFilled,
    dynasty: Histogram,
    tag: Clock
  }
  return iconMap[type] || Search
}

const getSuggestionIconColor = (type) => {
  const colorMap = {
    poem: '#667eea',
    author: '#ff6b6b',
    dynasty: '#51cf66',
    tag: '#f59f00'
  }
  return colorMap[type] || '#999'
}

const addToSearchHistory = (keyword) => {
  // 实际项目中可以保存到本地存储
  console.log('添加到搜索历史:', keyword)
}

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  keyword.value = newValue
})
</script>

<style scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-input {
  margin-bottom: 16px;
}

.search-btn {
  padding: 12px 24px;
  font-weight: 600;
}

.hot-keywords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-label {
  font-size: 14px;
  color: #7f8c8d;
  font-weight: 500;
}

.hot-tag {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.hot-tag:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f8f9fa;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateX(4px);
}

.suggestion-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.suggestion-icon {
  font-size: 16px;
}

.suggestion-text {
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
}

.suggestion-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggestion-type {
  color: #7f8c8d;
  font-size: 12px;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.suggestion-count {
  color: #667eea;
  font-size: 12px;
  font-weight: 500;
}

.suggestions-footer {
  padding: 12px 20px;
  text-align: center;
  font-size: 12px;
  color: #adb5bd;
  border-top: 1px solid #f8f9fa;
  background: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-box {
    max-width: 100%;
  }
  
  .search-container {
    padding: 16px;
    border-radius: 8px;
  }
  
  .hot-keywords {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .hot-label {
    align-self: flex-start;
  }
  
  .suggestion-item {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .suggestion-meta {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 12px;
  }
  
  .suggestions-header,
  .suggestion-item {
    padding: 12px;
  }
  
  .suggestion-content {
    gap: 8px;
  }
  
  .suggestion-icon {
    font-size: 14px;
  }
  
  .suggestion-text {
    font-size: 14px;
  }
}
</style>

