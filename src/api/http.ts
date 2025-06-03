import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: 'https://wufeng98.cn/codeSnippetApi' || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应类型接口
export interface ApiResponse<T> {
  data: T
  code: number
  message: string
}

// 请求拦截器：添加 token
http.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理响应
http.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>): AxiosResponse<T> => {
    // 提取 data 字段
    return {
      ...response,
      data: response.data.data
    } as AxiosResponse<T>
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      
      // 处理 401 未授权错误
      if (status === 401) {
        const authStore = useAuthStore()
        // 清除 token 并重定向到登录页
        authStore.logout()
        window.location.href = '/auth/login'
      }
      
      // 服务器返回的错误信息
      const errorMessage = (error.response.data as any)?.message || '请求失败'
      console.error(`[API Error] ${status}: ${errorMessage}`)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('[API Error] 网络错误，未收到响应')
    } else {
      // 请求配置出错
      console.error('[API Error] 请求配置错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http
