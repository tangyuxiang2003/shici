# 诗词赏析应用

基于Vue.js 3 + Element Plus + Supabase构建的现代化诗词应用。

## 功能特性

- 📚 **诗词浏览** - 查看完整的诗词库
- 🔍 **智能搜索** - 支持标题、内容、作者搜索
- 📖 **阅读全文** - 模态框阅读完整诗词内容
- 👤 **作者详情** - 查看诗词作者信息
- ➕ **添加诗词** - 管理员可添加新诗词
- 📱 **响应式设计** - 适配各种设备屏幕

## 技术栈

- **前端框架**: Vue.js 3 + Composition API
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **后端服务**: Supabase (PostgreSQL)
- **构建工具**: Vite

## 项目结构

```
src/
├── api/           # API接口
├── components/    # 公共组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── utils/         # 工具函数
│   └── supabase.js # Supabase配置
└── views/         # 页面组件
    ├── Home.vue    # 首页
    ├── Poems.vue  # 诗词管理
    └── PoemDetail.vue # 诗词详情
```

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

## Supabase配置

1. 在Supabase创建新项目
2. 导入数据库表结构（参考 `database_schema.sql`）
3. 配置环境变量：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## GitHub仓库重新配置

如果GitHub仓库被删除，需要重新配置：

### 步骤1：创建新仓库
1. 访问 https://github.com
2. 创建新仓库（不要初始化README）
3. 获取仓库URL

### 步骤2：更新远程配置
```bash
# 删除现有远程仓库
git remote remove origin

# 添加新远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 推送代码
git push -u origin main
```

### 步骤3：推送代码
```bash
git push -u origin main
```

## 数据库表结构

### poems表
- id (主键)
- title (标题)
- content (内容)
- author_id (作者ID)
- dynasty (朝代)
- created_at (创建时间)

### authors表
- id (主键)
- name (姓名)
- intro (简介)
- dynasty (朝代)

## 功能演示

### 首页功能
- 诗词统计展示
- 智能搜索框
- 诗词列表展示
- 阅读全文模态框

### 诗词管理
- 添加新诗词
- 搜索过滤
- 详情查看

### 响应式设计
- 桌面端：完整功能展示
- 移动端：优化布局体验

## 开发说明

### API接口
所有Supabase API接口封装在 `src/utils/supabase.js` 中：

```javascript
export const poemApi = {
  getPoems(),        // 获取诗词列表
  searchPoems(),     // 搜索诗词
  getPoemDetail(),   // 获取诗词详情
  addPoem(),         // 添加诗词
  getAuthors()       // 获取作者列表
}
```

### 状态管理
使用Pinia进行全局状态管理，包括：
- 诗词数据
- 搜索状态
- 用户偏好

## 部署说明

### Vercel部署
1. 连接GitHub仓库
2. 配置环境变量
3. 自动部署

### Netlify部署
1. 拖拽dist文件夹
2. 配置重定向规则

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 许可证

MIT License

## 联系方式

如有问题请联系项目维护者。

---

**注意**: 请确保在部署前正确配置Supabase环境变量，并导入数据库表结构。# shici
