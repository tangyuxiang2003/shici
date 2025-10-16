<template>
  <div class="authors">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>诗人列表</span>
            </div>
          </template>
          
          <el-table :data="authors" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="dynasty" label="朝代" width="100" />
            <el-table-column prop="lifespan" label="生卒年份" width="150" />
            <el-table-column prop="description" label="简介" show-overflow-tooltip />
            <el-table-column label="作品数量" width="100">
              <template #default="scope">
                <el-tag>{{ scope.row.worksCount }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small">查看作品</el-button>
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

// 模拟数据
const authors = ref([
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    lifespan: '701年-762年',
    description: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。',
    worksCount: 15
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    lifespan: '712年-770年',
    description: '唐代伟大的现实主义诗人，被后人誉为"诗圣"。',
    worksCount: 12
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    lifespan: '1037年-1101年',
    description: '北宋文学家、书画家，唐宋八大家之一。',
    worksCount: 8
  }
])
</script>

<style scoped>
.authors {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>