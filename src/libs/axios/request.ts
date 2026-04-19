/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 16:47
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-04-02 10:15
 * @FilePath     : \attendance-frontend-mobile\src\libs\axios\request.ts
 * @Description  :
 */
import axios from 'axios'
import qs from 'qs'
import { Message } from 'tdesign-mobile-vue'
import { useUserStore } from '@/stores/user-store'
import { getTokenUtil } from '@/utils/auth'

let userStore: ReturnType<typeof useUserStore> | null = null

function getUserStore() {
  if (!userStore) {
    userStore = useUserStore()
  }
  return userStore
}

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
      strictNullHandling: false // 不严格处理 null 值
    })
  }
})

// 全局请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    const token = getUserStore().loginUser.accessToken ?? getTokenUtil()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 全局响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 401 || data.code === 403) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/profile/get') &&
        !window.location.pathname.includes('auth/login')
      ) {
        Message.warning({
          message: '您的登录认证已失效或未登录，请先登录',
          showClose: true,
          plain: true
        })
        // 只保存路径和查询参数，不包含协议和域名
        const currentPath = window.location.pathname + window.location.search
        window.location.href = `/auth/portal?redirect=${encodeURIComponent(currentPath)}`
      }
    }
    return response
  },
  function (error) {
    // 任何超出 2xx 的状态码都会触发该函数
    return Promise.reject(error)
  }
)

export default axiosInstance
