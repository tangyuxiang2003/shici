import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 记录请求日志（开发环境）
    if (import.meta.env.DEV) {
      console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 记录响应日志（开发环境）
    if (import.meta.env.DEV) {
      console.log(`✅ 收到响应: ${response.config.url}`, response.data)
    }
    
    return response.data
  },
  (error) => {
    // 记录错误日志
    console.error('❌ 请求错误:', error)
    
    // 统一错误处理
    let message = '网络请求失败'
    
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      const errorMessages = {
        400: '请求参数错误',
        401: '未授权，请重新登录',
        403: '禁止访问',
        404: '资源不存在',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时'
      }
      
      message = errorMessages[status] || `请求失败 (${status})`
      
      // 401 错误跳转到登录页
      if (status === 401) {
        localStorage.removeItem('token')
        // 这里可以添加路由跳转到登录页的逻辑
        console.log('认证失败，请重新登录')
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message = '网络连接异常，请检查网络设置'
    } else {
      // 请求配置错误
      message = error.message
    }
    
    // 显示错误提示
    ElMessage.error(message)
    
    return Promise.reject(error)
  }
)

// 导出常用的 HTTP 方法
export const http = {
  get: (url, params) => request.get(url, { params }),
  post: (url, data) => request.post(url, data),
  put: (url, data) => request.put(url, data),
  delete: (url) => request.delete(url),
  patch: (url, data) => request.patch(url, data)
}

export default request