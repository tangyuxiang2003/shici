import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页 - 诗词赏析'
    }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: () => import('../views/Poems.vue'),
    meta: {
      title: '诗歌库 - 诗词赏析'
    }
  },
  {
    path: '/poems/:id',
    name: 'PoemDetail',
    component: () => import('../views/PoemDetail.vue'),
    meta: {
      title: '诗词详情 - 诗词赏析'
    }
  },
  {
    path: '/authors',
    name: 'Authors',
    component: () => import('../views/Authors.vue'),
    meta: {
      title: '诗人 - 诗词赏析'
    }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue'),
    meta: {
      title: '我的收藏 - 诗词赏析'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router