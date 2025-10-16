import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  try {
    console.log('=== 检查数据库表实际结构 ===\n')
    
    // 检查authors表结构
    console.log('1. authors表结构:')
    const { data: authorsData, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(1)
    
    if (authorsError) {
      console.log('❌ 无法访问authors表:', authorsError.message)
    } else if (authorsData && authorsData.length > 0) {
      console.log('✅ authors表有数据，列结构:')
      console.log(Object.keys(authorsData[0]))
    } else {
      // 插入一条测试数据来查看表结构
      const testAuthor = { name: '测试诗人', dynasty: '测试朝代' }
      const { data: testData, error: testError } = await supabase
        .from('authors')
        .insert([testAuthor])
        .select()
      
      if (testError) {
        console.log('❌ 测试插入失败:', testError.message)
      } else {
        console.log('✅ authors表结构:')
        console.log(Object.keys(testData[0]))
        // 删除测试数据
        await supabase.from('authors').delete().eq('id', testData[0].id)
      }
    }
    
    // 检查poems表结构
    console.log('\n2. poems表结构:')
    const { data: poemsData, error: poemsError } = await supabase
      .from('poems')
      .select('*')
      .limit(1)
    
    if (poemsError) {
      console.log('❌ 无法访问poems表:', poemsError.message)
    } else if (poemsData && poemsData.length > 0) {
      console.log('✅ poems表有数据，列结构:')
      console.log(Object.keys(poemsData[0]))
    } else {
      // 插入一条测试数据来查看表结构
      const testPoem = { title: '测试诗词', content: '测试内容' }
      const { data: testData, error: testError } = await supabase
        .from('poems')
        .insert([testPoem])
        .select()
      
      if (testError) {
        console.log('❌ 测试插入失败:', testError.message)
      } else {
        console.log('✅ poems表结构:')
        console.log(Object.keys(testData[0]))
        // 删除测试数据
        await supabase.from('poems').delete().eq('id', testData[0].id)
      }
    }
    
    // 检查现有数据
    console.log('\n3. 现有数据统计:')
    const tables = ['authors', 'poems', 'dynasties', 'system_config']
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
      
      if (error) {
        console.log(`❌ ${table}表: ${error.message}`)
      } else {
        console.log(`✅ ${table}表: ${data.length} 条记录`)
      }
    }
    
  } catch (error) {
    console.error('检查表结构时出错:', error.message)
  }
}

// 运行检查
checkTableStructure()