/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 16:47
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-28 16:28
 * @FilePath     : \attendance-frontend-mobile\src\libs\axios\request.ts
 * @Description  : 全局请求 AXIOS 封装配置
 */
import axios from 'axios'
import qs from 'qs'
import { Message } from 'tdesign-mobile-vue'
import { useUserStore } from '@/stores/user-store'
import { getTokenUtil } from '@/utils/auth'

const BASE_PATH = (import.meta.env.VITE_BASE_PATH || '').replace(/\/+$/, '')

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  // 参数序列化配置
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'brackets', // 数组格式化方式：brackets, indices, repeat, comma
      allowDots: true, // 允许使用点号表示嵌套对象
      skipNulls: false, // 不跳过 null 值
      strictNullHandling: false, // 不严格处理 null 值
    })
  },
})

// 全局请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    const token = userStore.loginUser.accessToken ?? getTokenUtil()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    const { data } = response
    const userStore = useUserStore()

    // 401：登录过期/未认证
    if (data.code === 401) {
      const currentPath = window.location.pathname + window.location.search

      if (!currentPath.startsWith(`${BASE_PATH}/auth`)) {
        Message.warning({ content: '登录认证已失效，请重新登录', offset: [10, 16] })
        userStore?.resetUserState()
        window.location.href = `${BASE_PATH}/auth/portal?redirect=${encodeURIComponent(currentPath)}`
      }
      return Promise.reject(new Error('认证失败'))
    }

    // 403：无权限访问资源（跳转无权限页面）
    if (data.code === 403) {
      if (!window.location.pathname.includes('/auth/unauthorized')) {
        Message.error({ content: '您没有权限执行此操作', offset: [10, 16] })
        window.location.href = `${BASE_PATH}/auth/unauthorized`
      }
      return Promise.reject(new Error('无权限'))
    }

    return response
  },
  function (error) {
    // 任何超出 2xx 的状态码都会触发该函数
    return Promise.reject(error)
  },
)

export default axiosInstance
