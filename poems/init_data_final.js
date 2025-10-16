import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function initDataFinal() {
  try {
    console.log('=== 诗词赏析网站 - 最终数据初始化 ===\n')
    
    // 1. 插入诗人数据（基于实际表结构）
    console.log('👨‍🎨 插入诗人数据...')
    const authors = [
      { 
        name: '李白', 
        dynasty: '唐代', 
        biography: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。创作了大量优秀的诗歌作品，代表作有《将进酒》、《蜀道难》等。' 
      },
      { 
        name: '杜甫', 
        dynasty: '唐代', 
        biography: '唐代伟大的现实主义诗人，被后人称为"诗圣"。诗歌深刻反映了唐代社会现实，代表作有《春望》、《登高》等。' 
      },
      { 
        name: '苏轼', 
        dynasty: '宋代', 
        biography: '北宋文学家、书画家，唐宋八大家之一。诗词、散文、书法、绘画均有很高成就，代表作有《水调歌头》等。' 
      },
      { 
        name: '李清照', 
        dynasty: '宋代', 
        biography: '宋代著名女词人，婉约派代表。词作婉约细腻，情感真挚，代表作有《声声慢》、《如梦令》等。' 
      },
      { 
        name: '白居易', 
        dynasty: '唐代', 
        biography: '唐代伟大的现实主义诗人，主张"文章合为时而著，歌诗合为事而作"。代表作有《长恨歌》、《琵琶行》等。' 
      },
      { 
        name: '王维', 
        dynasty: '唐代', 
        biography: '唐代著名诗人、画家，被誉为"诗佛"。诗作以山水田园为主，诗中有画，画中有诗。' 
      }
    ]
    
    const authorIds = {}
    for (const author of authors) {
      const { data, error } = await supabase
        .from('authors')
        .insert([author])
        .select()
      
      if (error) {
        console.log(`❌ 插入诗人 ${author.name} 失败: ${error.message}`)
      } else {
        authorIds[author.name] = data[0].id
        console.log(`✅ 插入诗人: ${author.name}`)
      }
    }
    
    // 2. 插入诗词数据（基于实际表结构）
    console.log('\n📜 插入诗词数据...')
    const poems = [
      {
        title: '静夜思',
        content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
        dynasty: '唐代',
        author_id: authorIds['李白'],
        views_count: 1520,
        likes_count: 890
      },
      {
        title: '春望',
        content: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。',
        dynasty: '唐代',
        author_id: authorIds['杜甫'],
        views_count: 1280,
        likes_count: 750
      },
      {
        title: '水调歌头·明月几时有',
        content: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。',
        dynasty: '宋代',
        author_id: authorIds['苏轼'],
        views_count: 1850,
        likes_count: 950
      },
      {
        title: '声声慢·寻寻觅觅',
        content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。\n乍暖还寒时候，最难将息。\n三杯两盏淡酒，怎敌他、晚来风急？\n雁过也，正伤心，却是旧时相识。',
        dynasty: '宋代',
        author_id: authorIds['李清照'],
        views_count: 1620,
        likes_count: 820
      },
      {
        title: '长恨歌（节选）',
        content: '汉皇重色思倾国，御宇多年求不得。\n杨家有女初长成，养在深闺人未识。\n天生丽质难自弃，一朝选在君王侧。\n回眸一笑百媚生，六宫粉黛无颜色。',
        dynasty: '唐代',
        author_id: authorIds['白居易'],
        views_count: 980,
        likes_count: 520
      },
      {
        title: '山居秋暝',
        content: '空山新雨后，天气晚来秋。\n明月松间照，清泉石上流。\n竹喧归浣女，莲动下渔舟。\n随意春芳歇，王孙自可留。',
        dynasty: '唐代',
        author_id: authorIds['王维'],
        views_count: 1120,
        likes_count: 680
      },
      {
        title: '将进酒',
        content: '君不见黄河之水天上来，奔流到海不复回。\n君不见高堂明镜悲白发，朝如青丝暮成雪。\n人生得意须尽欢，莫使金樽空对月。\n天生我材必有用，千金散尽还复来。',
        dynasty: '唐代',
        author_id: authorIds['李白'],
        views_count: 2100,
        likes_count: 1250
      },
      {
        title: '登高',
        content: '风急天高猿啸哀，渚清沙白鸟飞回。\n无边落木萧萧下，不尽长江滚滚来。\n万里悲秋常作客，百年多病独登台。\n艰难苦恨繁霜鬓，潦倒新停浊酒杯。',
        dynasty: '唐代',
        author_id: authorIds['杜甫'],
        views_count: 1350,
        likes_count: 720
      }
    ]
    
    for (const poem of poems) {
      const { error } = await supabase
        .from('poems')
        .insert([poem])
      
      if (error) {
        console.log(`❌ 插入诗词 ${poem.title} 失败: ${error.message}`)
      } else {
        console.log(`✅ 插入诗词: ${poem.title}`)
      }
    }
    
    console.log('\n🎉 数据初始化完成！')
    console.log('📊 统计:')
    console.log(`   - 诗人: ${authors.length} 位`)
    console.log(`   - 诗词: ${poems.length} 首`)
    console.log('\n💡 现在可以访问网站查看数据了！')
    console.log('🌐 网站地址: http://localhost:3000')
    
    // 3. 验证数据插入
    console.log('\n🔍 数据验证:')
    const { data: authorsCount } = await supabase
      .from('authors')
      .select('*', { count: 'exact' })
    
    const { data: poemsCount } = await supabase
      .from('poems')
      .select('*', { count: 'exact' })
    
    console.log(`   - 数据库中的诗人数量: ${authorsCount.length}`)
    console.log(`   - 数据库中的诗词数量: ${poemsCount.length}`)
    
  } catch (error) {
    console.error('❌ 初始化过程中出错:', error.message)
  }
}

// 运行初始化
initDataFinal()