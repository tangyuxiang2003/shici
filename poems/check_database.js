import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  try {
    console.log('=== 检查数据库表结构 ===\n')
    
    // 检查表是否存在
    const tables = ['authors', 'poems', 'appreciations', 'tags', 'poem_tags', 'dynasties', 'system_config']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ 表 ${table} 不存在或无法访问: ${error.message}`)
      } else {
        console.log(`✅ 表 ${table} 存在`)
        
        // 获取表结构信息
        const { data: columns, error: columnError } = await supabase
          .from(table)
          .select('*')
          .limit(0)
        
        if (!columnError) {
          console.log(`   - 列信息: ${Object.keys(columns || {}).join(', ')}`)
        }
      }
    }
    
    console.log('\n💡 建议:')
    console.log('1. 如果表不存在，请先执行 database_schema.sql 创建表结构')
    console.log('2. 如果表已存在但列不匹配，请检查表结构')
    
  } catch (error) {
    console.error('检查数据库时出错:', error.message)
  }
}

// 运行检查
checkDatabase()