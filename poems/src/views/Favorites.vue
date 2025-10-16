<template>
  <div class="favorites">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>我的收藏</span>
              <el-button 
                type="danger" 
                :icon="Delete" 
                :disabled="selectedFavorites.length === 0"
                @click="clearAllFavorites"
              >
                清空收藏
              </el-button>
            </div>
          </template>
          
          <el-alert
            v-if="favorites.length === 0"
            title="暂无收藏的诗歌"
            type="info"
            :closable="false"
            show-icon
          />
          
          <el-table 
            v-else
            :data="favorites" 
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="dynasty" label="朝代" width="100" />
            <el-table-column prop="content" label="内容" show-overflow-tooltip />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button 
                  link 
                  type="danger" 
                  size="small"
                  @click="removeFromFavorites(scope.row)"
                >
                  取消收藏
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const selectedFavorites = ref([])

// 模拟收藏数据
const favorites = ref([
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    dynasty: '唐代',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
  }
])

const handleSelectionChange = (selection) => {
  selectedFavorites.value = selection
}

const removeFromFavorites = (poem) => {
  const index = favorites.value.findIndex(fav => fav.id === poem.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  }
}

const clearAllFavorites = () => {
  favorites.value = []
  selectedFavorites.value = []
}
</script>

<style scoped>
.favorites {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>