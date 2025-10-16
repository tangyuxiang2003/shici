import { http } from '../utils/request'

// 诗词相关 API
export const poemApi = {
  // 获取诗词列表
  getPoems: (params = {}) => http.get('/poems', params),
  
  // 获取诗词详情
  getPoemDetail: (id) => http.get(`/poems/${id}`),
  
  // 搜索诗词
  searchPoems: (keyword, params = {}) => 
    http.get('/poems/search', { keyword, ...params }),
  
  // 获取搜索建议
  getSearchSuggestions: (keyword) => 
    http.get('/poems/suggestions', { keyword }),
  
  // 添加诗词（需要管理员权限）
  addPoem: (data) => http.post('/poems', data),
  
  // 更新诗词（需要管理员权限）
  updatePoem: (id, data) => http.put(`/poems/${id}`, data),
  
  // 删除诗词（需要管理员权限）
  deletePoem: (id) => http.delete(`/poems/${id}`),
  
  // 点赞诗词
  likePoem: (id) => http.post(`/poems/${id}/like`),
  
  // 取消点赞
  unlikePoem: (id) => http.delete(`/poems/${id}/like`),
  
  // 收藏诗词
  collectPoem: (id) => http.post(`/poems/${id}/collect`),
  
  // 取消收藏
  uncollectPoem: (id) => http.delete(`/poems/${id}/collect`)
}

// 作者相关 API
export const authorApi = {
  // 获取作者列表
  getAuthors: (params = {}) => http.get('/authors', params),
  
  // 获取作者详情
  getAuthorDetail: (id) => http.get(`/authors/${id}`),
  
  // 获取作者的诗词
  getAuthorPoems: (id, params = {}) => 
    http.get(`/authors/${id}/poems`, params)
}

// 赏析相关 API
export const appreciationApi = {
  // 获取诗词的赏析列表
  getPoemAppreciations: (poemId, params = {}) => 
    http.get(`/poems/${poemId}/appreciations`, params),
  
  // 获取赏析详情
  getAppreciationDetail: (id) => http.get(`/appreciations/${id}`),
  
  // 提交赏析
  submitAppreciation: (data) => http.post('/appreciations', data),
  
  // 更新赏析
  updateAppreciation: (id, data) => http.put(`/appreciations/${id}`, data),
  
  // 删除赏析
  deleteAppreciation: (id) => http.delete(`/appreciations/${id}`),
  
  // 点赞赏析
  likeAppreciation: (id) => http.post(`/appreciations/${id}/like`),
  
  // 取消点赞赏析
  unlikeAppreciation: (id) => http.delete(`/appreciations/${id}/like`)
}

// 评论相关 API
export const commentApi = {
  // 获取评论列表
  getComments: (targetType, targetId, params = {}) => 
    http.get(`/${targetType}/${targetId}/comments`, params),
  
  // 提交评论
  submitComment: (data) => http.post('/comments', data),
  
  // 删除评论
  deleteComment: (id) => http.delete(`/comments/${id}`),
  
  // 点赞评论
  likeComment: (id) => http.post(`/comments/${id}/like`),
  
  // 取消点赞评论
  unlikeComment: (id) => http.delete(`/comments/${id}/like`)
}

// 用户相关 API
export const userApi = {
  // 获取用户信息
  getUserInfo: () => http.get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => http.put('/user/info', data),
  
  // 获取用户收藏
  getUserCollections: (params = {}) => http.get('/user/collections', params),
  
  // 获取用户发布的赏析
  getUserAppreciations: (params = {}) => http.get('/user/appreciations', params)
}

export default {
  poemApi,
  authorApi,
  appreciationApi,
  commentApi,
  userApi
}