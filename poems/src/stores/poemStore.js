import { defineStore } from 'pinia'
import { ref } from 'vue'
import { poemApi } from '../utils/supabase'

export const usePoemStore = defineStore('poem', () => {
  // 状态
  const poems = ref([])
  const currentPoem = ref(null)
  const favorites = ref([])
  const loading = ref(false)
  const total = ref(0)
  
  // 筛选条件
  const filters = ref({
    dynasty: '',
    author: '',
    keyword: ''
  })

  // 获取诗词列表
  const getPoems = async (params = {}) => {
    try {
      loading.value = true
      const result = await poemApi.getPoems(params)
      poems.value = result.data
      total.value = result.total
      return result
    } catch (error) {
      console.error('获取诗词列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取诗词详情
  const getPoemDetail = async (id) => {
    try {
      loading.value = true
      const poem = await poemApi.getPoemDetail(id)
      currentPoem.value = poem
      
      // 增加浏览量
      await poemApi.incrementViews(id)
      
      return poem
    } catch (error) {
      console.error('获取诗词详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 搜索诗词
  const searchPoems = async (keyword, params = {}) => {
    try {
      loading.value = true
      const result = await poemApi.searchPoems(keyword, params)
      poems.value = result.data
      total.value = result.total
      return result
    } catch (error) {
      console.error('搜索诗词失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取作者列表
  const getAuthors = async () => {
    try {
      return await poemApi.getAuthors()
    } catch (error) {
      console.error('获取作者列表失败:', error)
      throw error
    }
  }

  // 获取朝代列表
  const getDynasties = async () => {
    try {
      return await poemApi.getDynasties()
    } catch (error) {
      console.error('获取朝代列表失败:', error)
      throw error
    }
  }

  // 本地收藏功能
  const toggleFavorite = (poem) => {
    const index = favorites.value.findIndex(fav => fav.id === poem.id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(poem)
    }
    
    // 保存到本地存储
    localStorage.setItem('poem_favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (poem) => {
    return favorites.value.some(fav => fav.id === poem.id)
  }

  // 初始化收藏列表
  const initFavorites = () => {
    const saved = localStorage.getItem('poem_favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  }

  // 设置筛选条件
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // 清除筛选条件
  const clearFilters = () => {
    filters.value = {
      dynasty: '',
      author: '',
      keyword: ''
    }
  }

  return {
    // 状态
    poems,
    currentPoem,
    favorites,
    loading,
    total,
    filters,
    
    // 方法
    getPoems,
    getPoemDetail,
    searchPoems,
    getAuthors,
    getDynasties,
    toggleFavorite,
    isFavorite,
    initFavorites,
    setFilters,
    clearFilters
  }
})