import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function initSimpleData() {
  try {
    console.log('=== 诗词赏析网站 - 简化数据初始化 ===\n')
    
    // 1. 先清空现有数据（可选）
    console.log('🗑️  清空现有数据...')
    const tables = ['poem_tags', 'appreciations', 'poems', 'authors', 'tags', 'dynasties', 'system_config']
    
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error && !error.message.includes('null')) {
        console.log(`清理表 ${table}: ${error.message}`)
      }
    }
    
    // 2. 插入朝代数据
    console.log('📅 插入朝代数据...')
    const dynasties = [
      { name: '先秦', start_year: -2100, end_year: -221, description: '中国历史上最早的朝代时期' },
      { name: '汉代', start_year: -202, end_year: 220, description: '中国历史上重要的统一王朝' },
      { name: '魏晋南北朝', start_year: 220, end_year: 589, description: '中国历史上的分裂时期' },
      { name: '唐代', start_year: 618, end_year: 907, description: '中国诗歌的黄金时代' },
      { name: '宋代', start_year: 960, end_year: 1279, description: '词文化繁荣的时期' },
      { name: '元代', start_year: 1271, end_year: 1368, description: '元曲发展的时期' },
      { name: '明代', start_year: 1368, end_year: 1644, description: '小说和戏曲发展的时期' },
      { name: '清代', start_year: 1644, end_year: 1912, description: '古典文学的总结时期' }
    ]
    
    for (const dynasty of dynasties) {
      const { error } = await supabase.from('dynasties').insert([dynasty])
      if (error) console.log(`插入朝代 ${dynasty.name} 失败: ${error.message}`)
      else console.log(`✅ 插入朝代: ${dynasty.name}`)
    }
    
    // 3. 插入诗人数据（简化字段）
    console.log('👨‍🎨 插入诗人数据...')
    const authors = [
      { name: '李白', dynasty: '唐代', birth_year: '701年', death_year: '762年', biography: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"' },
      { name: '杜甫', dynasty: '唐代', birth_year: '712年', death_year: '770年', biography: '唐代伟大的现实主义诗人，被后人称为"诗圣"' },
      { name: '苏轼', dynasty: '宋代', birth_year: '1037年', death_year: '1101年', biography: '北宋文学家、书画家，唐宋八大家之一' },
      { name: '李清照', dynasty: '宋代', birth_year: '1084年', death_year: '1155年', biography: '宋代著名女词人，婉约派代表' }
    ]
    
    const authorIds = {}
    for (const author of authors) {
      const { data, error } = await supabase.from('authors').insert([author]).select()
      if (error) {
        console.log(`❌ 插入诗人 ${author.name} 失败: ${error.message}`)
      } else {
        authorIds[author.name] = data[0].id
        console.log(`✅ 插入诗人: ${author.name}`)
      }
    }
    
    // 4. 插入诗词数据（简化字段）
    console.log('📜 插入诗词数据...')
    const poems = [
      {
        title: '静夜思',
        author_id: authorIds['李白'],
        dynasty: '唐代',
        content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
        background: '李白在旅途中思念故乡时所作。',
        difficulty_level: 2,
        views_count: 1500,
        likes_count: 890
      },
      {
        title: '春望',
        author_id: authorIds['杜甫'],
        dynasty: '唐代',
        content: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。',
        background: '安史之乱期间，杜甫被困长安时所作。',
        difficulty_level: 3,
        views_count: 1200,
        likes_count: 750
      },
      {
        title: '水调歌头·明月几时有',
        author_id: authorIds['苏轼'],
        dynasty: '宋代',
        content: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。',
        background: '苏轼在中秋夜思念弟弟苏辙时所作。',
        difficulty_level: 4,
        views_count: 1800,
        likes_count: 950
      },
      {
        title: '声声慢·寻寻觅觅',
        author_id: authorIds['李清照'],
        dynasty: '宋代',
        content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。\n乍暖还寒时候，最难将息。\n三杯两盏淡酒，怎敌他、晚来风急？\n雁过也，正伤心，却是旧时相识。',
        background: '李清照晚年流落江南时所作，表达了对亡夫的思念。',
        difficulty_level: 4,
        views_count: 1600,
        likes_count: 820
      }
    ]
    
    for (const poem of poems) {
      const { error } = await supabase.from('poems').insert([poem])
      if (error) console.log(`❌ 插入诗词 ${poem.title} 失败: ${error.message}`)
      else console.log(`✅ 插入诗词: ${poem.title}`)
    }
    
    // 5. 插入系统配置
    console.log('⚙️  插入系统配置...')
    const configs = [
      { config_key: 'site_name', config_value: '诗词赏析', description: '网站名称', is_public: true },
      { config_key: 'site_description', config_value: '探索千年文化瑰宝，品味诗词之美', description: '网站描述', is_public: true },
      { config_key: 'max_poems_per_page', config_value: '20', description: '每页显示诗词数量', is_public: false }
    ]
    
    for (const config of configs) {
      const { error } = await supabase.from('system_config').insert([config])
      if (error) console.log(`❌ 插入配置 ${config.config_key} 失败: ${error.message}`)
      else console.log(`✅ 插入配置: ${config.config_key}`)
    }
    
    console.log('\n🎉 数据初始化完成！')
    console.log('📊 统计:')
    console.log(`   - 朝代: ${dynasties.length} 个`)
    console.log(`   - 诗人: ${authors.length} 位`)
    console.log(`   - 诗词: ${poems.length} 首`)
    console.log(`   - 配置: ${configs.length} 项`)
    console.log('\n💡 现在可以访问网站查看数据了！')
    
  } catch (error) {
    console.error('❌ 初始化过程中出错:', error.message)
  }
}

// 运行初始化
initSimpleData()