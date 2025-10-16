import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Supabase配置
const supabaseUrl = 'https://awggamufhpmvmfyaeaat.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3Z2dhbXVmaHBtdm1meWFlYWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDkxMTQsImV4cCI6MjA3NjA4NTExNH0.O_HEMFXCGR_ia5yWxj3eXKrTwQpNN8H1nk9v1fIfHXQ'

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

async function initSampleData() {
  try {
    console.log('=== 诗词赏析网站 - 初始化示例数据 ===\n')
    
    // 1. 首先插入诗人数据
    console.log('📝 插入诗人数据...')
    const authors = [
      {
        name: '李白',
        dynasty: '唐代',
        birth_year: '701年',
        death_year: '762年',
        alias: '太白',
        birth_place: '绵州昌隆县（今四川江油）',
        biography: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
        achievements: '创作了大量优秀的诗歌作品，代表作有《将进酒》、《蜀道难》等。',
        portrait_url: ''
      },
      {
        name: '杜甫',
        dynasty: '唐代',
        birth_year: '712年',
        death_year: '770年',
        alias: '子美',
        birth_place: '河南巩县（今河南巩义）',
        biography: '唐代伟大的现实主义诗人，被后人称为"诗圣"。',
        achievements: '诗歌深刻反映了唐代社会现实，代表作有《春望》、《登高》等。',
        portrait_url: ''
      },
      {
        name: '苏轼',
        dynasty: '宋代',
        birth_year: '1037年',
        death_year: '1101年',
        alias: '子瞻',
        birth_place: '眉州眉山（今四川眉山）',
        biography: '北宋文学家、书画家，唐宋八大家之一。',
        achievements: '诗词、散文、书法、绘画均有很高成就，代表作有《水调歌头》等。',
        portrait_url: ''
      },
      {
        name: '李清照',
        dynasty: '宋代',
        birth_year: '1084年',
        death_year: '1155年',
        alias: '易安居士',
        birth_place: '齐州章丘（今山东章丘）',
        biography: '宋代著名女词人，婉约派代表。',
        achievements: '词作婉约细腻，情感真挚，代表作有《声声慢》、《如梦令》等。',
        portrait_url: ''
      }
    ]

    const authorIds = {}
    for (const author of authors) {
      const { data, error } = await supabase
        .from('authors')
        .insert([author])
        .select()
      
      if (error) {
        console.error(`❌ 插入诗人 ${author.name} 失败:`, error.message)
      } else {
        authorIds[author.name] = data[0].id
        console.log(`✅ 插入诗人: ${author.name}`)
      }
    }

    // 2. 插入诗词数据
    console.log('\n📚 插入诗词数据...')
    const poems = [
      {
        title: '静夜思',
        author_id: authorIds['李白'],
        dynasty: '唐代',
        content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
        background: '李白在旅途中思念故乡时所作。',
        annotation: '通过明月寄托思乡之情，语言简练，意境深远。',
        translation: '明亮的月光洒在床前，好像地上泛起了一层霜。\n我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
        rhythm_pattern: '五言绝句',
        tags: ['思乡', '明月', '抒情'],
        difficulty_level: 2,
        views_count: 1500,
        likes_count: 890,
        is_verified: true
      },
      {
        title: '春望',
        author_id: authorIds['杜甫'],
        dynasty: '唐代',
        content: '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。',
        background: '安史之乱期间，杜甫被困长安时所作。',
        annotation: '表达了诗人对国家命运的忧虑和对家人的思念。',
        translation: '国家沦陷只有山河依旧，春日的城区里荒草丛生。\n忧心伤感见花开却流泪，别离家人鸟鸣令我心悸。\n战火硝烟三月不曾停息，家人书信珍贵能值万金。\n愁绪缠绕搔头思考，白发越搔越短，简直插不住簪子。',
        rhythm_pattern: '五言律诗',
        tags: ['忧国', '思乡', '战争'],
        difficulty_level: 3,
        views_count: 1200,
        likes_count: 750,
        is_verified: true
      },
      {
        title: '水调歌头·明月几时有',
        author_id: authorIds['苏轼'],
        dynasty: '宋代',
        content: '明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。\n我欲乘风归去，又恐琼楼玉宇，高处不胜寒。\n起舞弄清影，何似在人间。',
        background: '苏轼在中秋夜思念弟弟苏辙时所作。',
        annotation: '表达了诗人对人生的思考和对亲人的思念。',
        translation: '明月从什么时候才开始出现的？我端起酒杯遥问苍天。\n不知道在天上的宫殿，今天晚上是何年何月。\n我想要乘御清风回到天上，又恐怕在美玉砌成的楼宇，受不住高耸九天的寒冷。\n翩翩起舞玩赏着月下清影，哪像是在人间。',
        rhythm_pattern: '词',
        tags: ['中秋', '思亲', '人生'],
        difficulty_level: 4,
        views_count: 1800,
        likes_count: 950,
        is_verified: true
      },
      {
        title: '声声慢·寻寻觅觅',
        author_id: authorIds['李清照'],
        dynasty: '宋代',
        content: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。\n乍暖还寒时候，最难将息。\n三杯两盏淡酒，怎敌他、晚来风急？\n雁过也，正伤心，却是旧时相识。',
        background: '李清照晚年流落江南时所作，表达了对亡夫的思念。',
        annotation: '通过叠字手法，深刻表达了词人内心的孤寂和悲伤。',
        translation: '苦苦地寻寻觅觅，却只见冷冷清清，怎不让人凄惨悲戚。\n乍暖还寒的时节，最难保养休息。\n喝三杯两杯淡酒，怎么能抵得住早晨的寒风急袭？\n一行大雁从眼前飞过，更让人伤心，因为都是旧日的相识。',
        rhythm_pattern: '词',
        tags: ['悲伤', '思念', '婉约'],
        difficulty_level: 4,
        views_count: 1600,
        likes_count: 820,
        is_verified: true
      }
    ]

    const poemIds = {}
    for (const poem of poems) {
      const { data, error } = await supabase
        .from('poems')
        .insert([poem])
        .select()
      
      if (error) {
        console.error(`❌ 插入诗词 ${poem.title} 失败:`, error.message)
      } else {
        poemIds[poem.title] = data[0].id
        console.log(`✅ 插入诗词: ${poem.title}`)
      }
    }

    // 3. 插入赏析数据
    console.log('\n📖 插入赏析数据...')
    const appreciations = [
      {
        poem_id: poemIds['静夜思'],
        title: '月夜思乡的千古绝唱',
        content: '《静夜思》是李白最著名的诗作之一，通过简洁的语言表达了深沉的思乡之情。诗中"床前明月光，疑是地上霜"的比喻，既形象又富有诗意。整首诗语言平实，情感真挚，成为千古传诵的佳作。',
        summary: '李白通过明月寄托思乡之情的经典之作',
        tags: ['简洁', '深情', '经典'],
        likes_count: 120,
        status: 'published',
        is_featured: true
      },
      {
        poem_id: poemIds['春望'],
        title: '战乱中的家国情怀',
        content: '杜甫的《春望》深刻反映了安史之乱时期的社会现实。诗中"国破山河在"的开篇就奠定了悲壮的基调，"家书抵万金"更是成为千古名句，表达了战乱时期人们对亲情的珍视。',
        summary: '杜甫忧国忧民情怀的典型代表',
        tags: ['忧国', '现实', '深刻'],
        likes_count: 95,
        status: 'published',
        is_featured: true
      },
      {
        poem_id: poemIds['水调歌头·明月几时有'],
        title: '中秋夜的哲学思考',
        content: '苏轼的这首词不仅表达了对亲人的思念，更包含了对人生的深刻思考。"起舞弄清影，何似在人间"体现了诗人对现实生活的热爱，展现了苏轼豁达的人生态度。',
        summary: '苏轼中秋词的巅峰之作',
        tags: ['哲学', '豁达', '中秋'],
        likes_count: 150,
        status: 'published',
        is_featured: true
      }
    ]

    for (const appreciation of appreciations) {
      const { data, error } = await supabase
        .from('appreciations')
        .insert([appreciation])
        .select()
      
      if (error) {
        console.error(`❌ 插入赏析失败:`, error.message)
      } else {
        console.log(`✅ 插入赏析: ${appreciation.title}`)
      }
    }

    // 4. 插入标签数据
    console.log('\n🏷️ 插入标签数据...')
    const tags = [
      { name: '思乡', description: '表达对故乡思念的作品' },
      { name: '明月', description: '以月亮为主题的作品' },
      { name: '抒情', description: '抒发个人情感的作品' },
      { name: '忧国', description: '关心国家命运的作品' },
      { name: '战争', description: '反映战争题材的作品' },
      { name: '中秋', description: '中秋主题的作品' },
      { name: '思亲', description: '思念亲人的作品' },
      { name: '人生', description: '探讨人生哲理的作品' },
      { name: '悲伤', description: '表达悲伤情绪的作品' },
      { name: '婉约', description: '婉约派风格的作品' },
      { name: '简洁', description: '语言简洁明了的作品' },
      { name: '深情', description: '情感真挚深沉的作品' },
      { name: '经典', description: '经典传世的作品' },
      { name: '现实', description: '反映社会现实的作品' },
      { name: '深刻', description: '思想深刻的作品' },
      { name: '哲学', description: '包含哲学思考的作品' },
      { name: '豁达', description: '表现豁达人生态度的作品' }
    ]

    for (const tag of tags) {
      const { data, error } = await supabase
        .from('tags')
        .insert([tag])
        .select()
      
      if (error) {
        console.error(`❌ 插入标签 ${tag.name} 失败:`, error.message)
      } else {
        console.log(`✅ 插入标签: ${tag.name}`)
      }
    }

    console.log('\n🎉 示例数据初始化完成！')
    console.log('📊 数据统计:')
    console.log(`   - 诗人: ${authors.length} 位`)
    console.log(`   - 诗词: ${poems.length} 首`)
    console.log(`   - 赏析: ${appreciations.length} 篇`)
    console.log(`   - 标签: ${tags.length} 个`)
    console.log('\n💡 现在您可以在网站上查看这些示例数据了！')

  } catch (error) {
    console.error('❌ 数据初始化过程中出错:', error.message)
  }
}

// 运行数据初始化
initSampleData()