import { ElMessage } from 'element-plus'

// AI助手API服务
class AIAssistantService {
  constructor() {
    // 支持多个端口，优先尝试5678，失败后自动切换到8765
    this.portOptions = [5678, 8765]
    this.currentPortIndex = 0
    this.webhookPath = '/webhook-test/chat-handler' // 测试环境webhook路径
  }

  getBaseURL() {
    return `http://localhost:${this.portOptions[this.currentPortIndex]}`
  }

  async switchToNextPort() {
    if (this.currentPortIndex < this.portOptions.length - 1) {
      this.currentPortIndex++
      console.log(`切换到端口: ${this.portOptions[this.currentPortIndex]}`)
      return true
    }
    return false
  }

  /**
   * 发送消息到AI助手
   * @param {string} message 用户消息
   * @param {Object} context 上下文信息（当前页面、用户信息等）
   * @returns {Promise<string>} AI回复
   */
  async sendMessage(message, context = {}) {
    try {
      // 调用真实的n8n webhook
      const response = await this.callN8NWebhook(message, context)
      return response
    } catch (error) {
      console.error('AI助手服务错误:', error)
      // 如果n8n服务不可用，使用本地智能回复作为备用方案
      return this.generateIntelligentResponse(message, context)
    }
  }

  /**
   * 调用n8n webhook
   * @param {string} message 用户消息
   * @param {Object} context 上下文
   * @returns {Promise<string>} 处理结果
   */
  async callN8NWebhook(message, context) {
    const webhookURL = `${this.getBaseURL()}${this.webhookPath}`
    
    const requestData = {
      userInput: message,
      context: {
        page: context.page || window.location.pathname,
        timestamp: context.timestamp || new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language
      }
    }

    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 根据n8n工作流的响应格式解析回复
      if (data.success && data.data && data.data.response) {
        return data.data.response
      } else if (data.response) {
        // 如果响应格式不同，尝试直接获取response字段
        return data.response
      } else {
        throw new Error('无效的响应格式')
      }
    } catch (error) {
      console.error(`n8n webhook调用失败 (端口${this.portOptions[this.currentPortIndex]}):`, error)
      
      // 尝试切换到下一个端口
      if (await this.switchToNextPort()) {
        console.log('尝试使用备用端口...')
        return await this.callN8NWebhook(message, context)
      }
      
      throw new Error('AI服务暂时不可用，使用本地智能回复')
    }
  }

  /**
   * 生成智能回复
   * @param {string} message 用户消息
   * @param {Object} context 上下文
   * @returns {string} 回复内容
   */
  generateIntelligentResponse(message, context) {
    const lowerMessage = message.toLowerCase().trim()
    
    // 诗词相关问答
    if (lowerMessage.includes('推荐') || lowerMessage.includes('经典') || lowerMessage.includes('好诗')) {
      return this.getPoemRecommendations(lowerMessage)
    }
    
    if (lowerMessage.includes('李白') || lowerMessage.includes('诗仙')) {
      return this.getPoetInfo('李白')
    }
    
    if (lowerMessage.includes('杜甫')) {
      return this.getPoetInfo('杜甫')
    }
    
    if (lowerMessage.includes('苏轼')) {
      return this.getPoetInfo('苏轼')
    }
    
    if (lowerMessage.includes('朝代') || lowerMessage.includes('历史')) {
      return this.getDynastyInfo()
    }
    
    if (lowerMessage.includes('月亮') || lowerMessage.includes('明月') || lowerMessage.includes('月')) {
      return this.getMoonPoems()
    }
    
    if (lowerMessage.includes('春天') || lowerMessage.includes('春')) {
      return this.getSpringPoems()
    }
    
    if (lowerMessage.includes('爱情') || lowerMessage.includes('相思')) {
      return this.getLovePoems()
    }
    
    if (lowerMessage.includes('解释') || lowerMessage.includes('意思') || lowerMessage.includes('赏析')) {
      return this.getPoemAnalysis(lowerMessage)
    }
    
    // 默认回复
    return this.getDefaultResponse(message)
  }

  /**
   * 获取诗词推荐
   */
  getPoemRecommendations(message) {
    const recommendations = {
      '唐诗': [
        '《静夜思》 - 李白：床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        '《春晓》 - 孟浩然：春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        '《登鹳雀楼》 - 王之涣：白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
      ],
      '宋词': [
        '《水调歌头》 - 苏轼：明月几时有，把酒问青天。不知天上宫阙，今夕是何年。',
        '《声声慢》 - 李清照：寻寻觅觅，冷冷清清，凄凄惨惨戚戚。',
        '《青玉案·元夕》 - 辛弃疾：东风夜放花千树，更吹落，星如雨。'
      ],
      'default': [
        '《将进酒》 - 李白：君不见黄河之水天上来，奔流到海不复回。',
        '《枫桥夜泊》 - 张继：月落乌啼霜满天，江枫渔火对愁眠。',
        '《相思》 - 王维：红豆生南国，春来发几枝。愿君多采撷，此物最相思。'
      ]
    }
    
    let key = 'default'
    if (message.includes('唐')) key = '唐诗'
    if (message.includes('宋')) key = 'default'
    
    const poems = recommendations[key]
    const selected = poems.slice(0, 3)
    
    return `以下是一些经典${key}推荐：\n\n${selected.map((poem, i) => `${i + 1}. ${poem}`).join('\n\n')}\n\n您想了解哪首诗的详细内容？`
  }

  /**
   * 获取诗人信息
   */
  getPoetInfo(poetName) {
    const poets = {
      '李白': {
        info: '李白（701年－762年），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
        style: '诗歌风格豪放飘逸，想象丰富，语言清新自然。',
        works: ['《将进酒》', '《蜀道难》', '《望庐山瀑布》', '《早发白帝城》'],
        influence: '对后世诗歌创作产生了深远影响，与杜甫并称"李杜"。'
      },
      '杜甫': {
        info: '杜甫（712年－770年），字子美，自号少陵野老，唐代伟大的现实主义诗人，被尊为"诗圣"。',
        style: '诗歌沉郁顿挫，反映社会现实，关心民生疾苦。',
        works: ['《春望》', '《登高》', '《茅屋为秋风所破歌》', '《兵车行》'],
        influence: '其诗被称为"诗史"，对后世现实主义诗歌影响深远。'
      },
      '苏轼': {
        info: '苏轼（1037年－1101年），字子瞻，号东坡居士，北宋著名文学家、书画家。',
        style: '诗词豪放洒脱，题材广泛，意境开阔。',
        works: ['《水调歌头》', '《念奴娇·赤壁怀古》', '《江城子》', '《定风波》'],
        influence: '唐宋八大家之一，开创豪放词派。'
      }
    }
    
    const poet = poets[poetName] || poets['李白']
    return `**${poetName}**\n\n${poet.info}\n\n**诗歌风格：** ${poet.style}\n\n**代表作品：** ${poet.works.join('、')}\n\n**历史影响：** ${poet.influence}`
  }

  /**
   * 获取朝代信息
   */
  getDynastyInfo() {
    return `中国诗词发展主要经历了以下重要朝代：

**1. 先秦时期**（公元前11世纪-前221年）
   - 《诗经》：中国最早的诗歌总集
   - 《楚辞》：屈原创作的浪漫主义诗歌

**2. 汉代**（前202年-220年）
   - 乐府诗：民间歌谣收集整理
   - 古诗十九首：文人五言诗成熟标志

**3. 魏晋南北朝**（220年-589年）
   - 建安文学：曹操、曹植等
   - 陶渊明：田园诗派创始人

**4. 唐代**（618年-907年）
   - 诗歌黄金时代，李白、杜甫、白居易等
   - 近体诗（律诗、绝句）成熟

**5. 宋代**（960年-1279年）
   - 宋词繁荣，苏轼、李清照、辛弃疾等
   - 诗歌继续发展，理学诗兴起

**6. 元代**（1271年-1368年）
   - 元曲兴起，散曲、杂剧繁荣

**7. 明清时期**（1368年-1912年）
   - 诗词继续发展，流派纷呈

您想了解哪个朝代的详细情况？`
  }

  /**
   * 获取月亮相关诗词
   */
  getMoonPoems() {
    return `描写月亮的经典诗词有很多，以下是一些代表作：

**唐诗：**
1. **李白《静夜思》**
   "床前明月光，疑是地上霜。举头望明月，低头思故乡。"
   - 主题：思乡之情

2. **张九龄《望月怀远》**
   "海上生明月，天涯共此时。"
   - 主题：怀远思亲

3. **杜甫《月夜忆舍弟》**
   "露从今夜白，月是故乡明。"
   - 主题：兄弟情深

**宋词：**
1. **苏轼《水调歌头》**
   "明月几时有，把酒问青天。不知天上宫阙，今夕是何年。"
   - 主题：人生感慨

2. **张若虚《春江花月夜》**
   "春江潮水连海平，海上明月共潮生。"
   - 主题：宇宙人生思考

这些诗词都通过月亮表达了不同的情感和意境，展现了古人丰富的想象力。`
  }

  /**
   * 获取春天相关诗词
   */
  getSpringPoems() {
    return `描写春天的经典诗词：

1. **孟浩然《春晓》**
   "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。"
   - 描绘春日清晨的生机勃勃

2. **杜甫《春夜喜雨》**
   "好雨知时节，当春乃发生。随风潜入夜，润物细无声。"
   - 赞美春雨的及时和温柔

3. **白居易《钱塘湖春行》**
   "乱花渐欲迷人眼，浅草才能没马蹄。"
   - 描写西湖早春美景

4. **贺知章《咏柳》**
   "碧玉妆成一树高，万条垂下绿丝绦。"
   - 赞美柳树的婀娜多姿

春天在诗词中常被赋予新生、希望和美好的象征意义。`
  }

  /**
   * 获取爱情相关诗词
   */
  getLovePoems() {
    return `表达爱情的经典诗词：

1. **王维《相思》**
   "红豆生南国，春来发几枝。愿君多采撷，此物最相思。"
   - 以红豆象征相思之情

2. **李商隐《无题》**
   "相见时难别亦难，东风无力百花残。春蚕到死丝方尽，蜡炬成灰泪始干。"
   - 表达坚贞不渝的爱情

3. **秦观《鹊桥仙》**
   "两情若是久长时，又岂在朝朝暮暮。"
   - 歌颂真挚永恒的爱情

4. **李清照《一剪梅》**
   "此情无计可消除，才下眉头，却上心头。"
   - 描写深切的相思之苦

这些诗词展现了古人丰富细腻的情感世界。`
  }

  /**
   * 获取诗词赏析
   */
  getPoemAnalysis(message) {
    // 简单的关键词匹配赏析
    if (message.includes('静夜思')) {
      return `**《静夜思》赏析：**

**诗歌原文：**
床前明月光，疑是地上霜。
举头望明月，低头思故乡。

**赏析要点：**
1. **意象选择**：明月光、地上霜，营造清冷思乡氛围
2. **情感表达**：通过"举头""低头"的动作描写，展现思乡之情
3. **语言特点**：语言朴素自然，意境深远
4. **艺术特色**：白描手法，情景交融

这首诗以简洁的语言表达了深切的思乡之情，成为千古传诵的名篇。`
    }
    
    return `关于您询问的诗词，我可以提供以下赏析角度：

1. **创作背景**：诗人创作时的时代背景和个人经历
2. **主题思想**：诗歌表达的核心思想和情感
3. **艺术特色**：诗歌的艺术手法和语言特点
4. **意象分析**：诗歌中使用的意象及其象征意义
5. **历史影响**：诗歌在文学史上的地位和影响

请告诉我具体想了解哪首诗的赏析？`
  }

  /**
   * 获取默认回复
   */
  getDefaultResponse(message) {
    const responses = [
      `关于"${message}"，我可以为您提供以下帮助：\n\n1. 相关诗词推荐\n2. 诗人背景介绍\n3. 诗词赏析解读\n4. 历史背景说明\n\n请告诉我您具体想了解哪个方面？`,
      
      `您的问题"${message}"涉及诗词文化的多个方面。我可以帮您：\n\n• 查找相关诗词作品\n• 介绍诗人背景\n• 提供诗词赏析\n• 解释文化内涵\n\n请具体说明您想了解的内容。`,
      
      `感谢您的提问！作为诗词AI助手，我可以为您提供：\n\n📚 诗词推荐和搜索\n👨‍🎓 诗人介绍和作品\n🔍 诗词赏析和解读\n🏛️ 历史文化背景\n\n请告诉我您具体需要什么帮助？`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * 获取快速回复建议
   */
  getQuickReplies() {
    return [
      '推荐一些经典唐诗',
      '介绍一下李白',
      '有哪些描写月亮的诗词？',
      '唐诗和宋词有什么区别？',
      '推荐爱情主题的诗词'
    ]
  }
}

// 创建单例实例
const aiAssistantService = new AIAssistantService()

export default aiAssistantService