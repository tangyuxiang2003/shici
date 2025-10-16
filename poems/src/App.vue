<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <div class="logo">
            <h1>诗词赏析</h1>
            <span class="subtitle">中华传统文化瑰宝</span>
          </div>
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            router
            class="nav-menu"
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>
              首页
            </el-menu-item>
            <el-menu-item index="/poems">
              <el-icon><Notebook /></el-icon>
              诗歌库
            </el-menu-item>
            <el-menu-item index="/authors">
              <el-icon><UserFilled /></el-icon>
              诗人
            </el-menu-item>
            <el-menu-item index="/favorites">
              <el-icon><StarFilled /></el-icon>
              我的收藏
            </el-menu-item>
          </el-menu>
        </div>
      </el-header>
      
      <el-main class="app-main">
        <router-view />
      </el-main>
      
      <el-footer class="app-footer">
        <div class="footer-content">
          <p>© 2024 诗词赏析平台 - 传承中华优秀传统文化</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeFilled, 
  Notebook, 
  UserFilled, 
  StarFilled 
} from '@element-plus/icons-vue'

const route = useRoute()
const activeIndex = ref('/')

watch(() => route.path, (newPath) => {
  activeIndex.value = newPath
}, { immediate: true })
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.app-header {
  padding: 0;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo h1 {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.logo .subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-left: 10px;
}

.nav-menu {
  background: transparent !important;
  border: none !important;
}

.nav-menu .el-menu-item {
  color: white !important;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-bottom-color: rgba(255, 255, 255, 0.5);
}

.nav-menu .el-menu-item.is-active {
  background: rgba(255, 255, 255, 0.1) !important;
  border-bottom-color: #ffd04b;
  color: #ffd04b !important;
}

.app-main {
  padding: 20px;
  min-height: calc(100vh - 140px);
}

.app-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 10px;
  }
  
  .logo {
    margin-bottom: 10px;
    text-align: center;
  }
  
  .nav-menu {
    width: 100%;
  }
}
</style>