import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('=== 诗词赏析网站数据库设置工具 ===\n')
    
    // 读取SQL文件
    const sqlFilePath = path.join(process.cwd(), 'database_schema.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    
    console.log('✅ SQL文件读取成功')
    console.log('📊 数据库连接信息:')
    console.log(`   URL: ${supabaseUrl}`)
    console.log(`   密钥: ${supabaseKey.substring(0, 20)}...\n`)
    
    console.log('📋 数据库表结构概览:')
    console.log('   1. authors - 诗人信息表')
    console.log('   2. poems - 诗词内容表')
    console.log('   3. appreciations - 赏析表')
    console.log('   4. tags - 标签表')
    console.log('   5. poem_tags - 诗词标签关联表')
    console.log('   6. dynasties - 朝代信息表')
    console.log('   7. system_config - 系统配置表\n')
    
    console.log('🚀 设置步骤:')
    console.log('   1. 访问 Supabase 控制台: https://awggamufhpmvmfyaeaat.supabase.co')
    console.log('   2. 点击左侧菜单的 "SQL Editor"')
    console.log('   3. 点击 "New query" 创建新查询')
    console.log('   4. 复制以下SQL内容到编辑器中')
    console.log('   5. 点击 "Run" 执行SQL语句\n')
    
    console.log('📝 SQL内容预览 (前500字符):')
    console.log('='.repeat(60))
    console.log(sqlContent.substring(0, 500) + '...')
    console.log('='.repeat(60))
    
    // 将SQL内容保存到单独的文件，方便复制
    const outputFile = path.join(process.cwd(), 'supabase_setup_instructions.txt')
    const instructions = `
诗词赏析网站 - Supabase数据库设置指南

数据库URL: ${supabaseUrl}

设置步骤:
1. 访问 Supabase 控制台: ${supabaseUrl}
2. 点击左侧菜单的 "SQL Editor"
3. 点击 "New query" 创建新查询
4. 复制下面的SQL内容到编辑器中
5. 点击 "Run" 执行SQL语句

SQL内容:
${sqlContent}

注意事项:
- 确保已启用 "uuid-ossp" 扩展
- 执行完成后可以查看表结构
- 初始数据会自动插入朝代和系统配置

完成后，您可以在 "Table Editor" 中查看创建的表结构。
    `
    
    fs.writeFileSync(outputFile, instructions)
    console.log(`\n✅ 详细设置指南已保存到: supabase_setup_instructions.txt`)
    console.log('💡 提示: 您可以直接复制该文件中的SQL内容到Supabase控制台执行')
    
  } catch (error) {
    console.error('❌ 设置过程中出错:', error.message)
  }
}

// 运行设置
setupDatabase()