import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey)

// 诗词相关API
export const poemApi = {
  // 获取诗词列表
  getPoems: async (params = {}) => {
    const { page = 1, pageSize = 10, dynasty, author } = params
    
    let query = supabase
      .from('poems')
      .select(`
        *,
        authors(name, dynasty)
      `, { count: 'exact' })
    
    // 添加筛选条件
    if (dynasty) {
      query = query.eq('dynasty', dynasty)
    }
    
    if (author) {
      query = query.eq('authors.name', author)
    }
    
    // 分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await query
      .order('id', { ascending: true })
      .range(from, to)
    
    if (error) throw error
    
    return {
      data: data.map(item => ({
        id: item.id,
        title: item.title,
        author: item.authors?.name || '未知作者',
        dynasty: item.dynasty,
        content: item.content,
        views: item.views_count || 0,
        likes_count: item.likes_count || 0,
        created_at: item.created_at
      })),
      total: count
    }
  },
  
  // 获取诗词详情
  getPoemDetail: async (id) => {
    const { data, error } = await supabase
      .from('poems')
      .select(`
        *,
        authors(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      title: data.title,
      author: data.authors?.name || '未知作者',
      author_id: data.authors?.id,
      dynasty: data.dynasty,
      content: data.content,
      views: data.views_count || 0,
      likes_count: data.likes_count || 0,
      created_at: data.created_at
    }
  },
  
  // 搜索诗词
  searchPoems: async (keyword, params = {}) => {
    const { page = 1, pageSize = 10 } = params
    
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    const { data, error, count } = await supabase
      .from('poems')
      .select(`
        *,
        authors(name)
      `, { count: 'exact' })
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .order('id', { ascending: true })
      .range(from, to)
    
    if (error) throw error
    
    return {
      data: data.map(item => ({
        id: item.id,
        title: item.title,
        author: item.authors?.name || '未知作者',
        dynasty: item.dynasty,
        content: item.content,
        views: item.views_count || 0,
        likes_count: item.likes_count || 0
      })),
      total: count
    }
  },
  
  // 获取作者列表
  getAuthors: async () => {
    const { data, error } = await supabase
      .from('authors')
      .select('name')
      .order('name')
    
    if (error) throw error
    return data.map(item => item.name)
  },
  
  // 获取朝代列表
  getDynasties: async () => {
    const { data, error } = await supabase
      .from('poems')
      .select('dynasty')
      .order('dynasty')
    
    if (error) throw error
    
    // 去重
    const uniqueDynasties = [...new Set(data.map(item => item.dynasty))]
    return uniqueDynasties.sort()
  },
  
  // 增加浏览量
  incrementViews: async (poemId) => {
    const { error } = await supabase.rpc('increment_views', { poem_id: poemId })
    if (error) console.error('增加浏览量失败:', error)
  },
  
  // 添加诗歌
  addPoem: async (poemData) => {
    const { title, author, dynasty, content } = poemData
    
    // 首先检查作者是否存在
    let { data: authorData, error: authorError } = await supabase
      .from('authors')
      .select('id')
      .eq('name', author)
      .single()
    
    let authorId
    
    if (authorError || !authorData) {
      // 作者不存在，创建新作者
      const { data: newAuthor, error: newAuthorError } = await supabase
        .from('authors')
        .insert([{ name: author, dynasty: dynasty }])
        .select()
        .single()
      
      if (newAuthorError) throw newAuthorError
      authorId = newAuthor.id
    } else {
      authorId = authorData.id
    }
    
    // 添加诗歌
    const { data, error } = await supabase
      .from('poems')
      .insert([{
        title: title,
        author_id: authorId,
        dynasty: dynasty,
        content: content,
        views_count: 0,
        likes_count: 0
      }])
      .select(`
        *,
        authors(name)
      `)
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      title: data.title,
      author: data.authors?.name || author,
      dynasty: data.dynasty,
      content: data.content,
      views: data.views_count || 0,
      likes_count: data.likes_count || 0,
      created_at: data.created_at
    }
  }
}

export default poemApi