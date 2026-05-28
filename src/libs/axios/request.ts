/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 16:47
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-21 15:58
 * @FilePath     : \attendance-frontend-mobile\src\libs\axios\request.ts
 * @Description  : 全局请求 AXIOS 封装配置
 */
import axios from 'axios'
import qs from 'qs'
import { Message } from 'tdesign-mobile-vue'

import router from '@/router'
import { useUserStore } from '@/stores/user-store'
import { getRefreshTokenUtil, getAccessTokenUtil } from '@/utils/auth'
import { userRefreshTokenUsingPost } from '@/api/auth-controller'

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

// 用于存储刷新令牌 Promise 的变量
let refreshTokenPromise: Promise<string> | null = null

/**
 * 统一强制登出处理（非主动登出，仅清理客户端本地状态，不请求服务端）
 * @param currentPath 当前路由路径
 * @param errorMsg 错误信息
 * @returns Promise.reject
 */
const handleForceLogout = (currentPath: string, errorMsg: string) => {
  const userStore = useUserStore()
  if (!currentPath.startsWith(`${BASE_PATH}/auth`)) {
    Message.warning({ content: '登录认证已失效，请重新登录', offset: [10, 16] })
    userStore.resetUserState()
    router.replace(`${BASE_PATH}/auth/portal?redirect=${encodeURIComponent(currentPath)}`)
  }
  return Promise.reject(new Error(errorMsg))
}

/**
 * 刷新 Token，成功返回新 Token，失败统一触发登出
 * @param currentPath 当前路由路径
 * @return Promise<string> 新 Token
 */
async function handleRefreshToken(currentPath: string): Promise<string> {
  const userStore = useUserStore()
  const refreshToken = userStore.loginUser.refreshToken ?? getRefreshTokenUtil()

  if (!refreshToken) {
    return handleForceLogout(currentPath, '无 RefreshToken')
  }

  try {
    const res = await userRefreshTokenUsingPost({ refreshToken })
    if (res.data.code === 0 && res.data.data) {
      userStore.setLoginUserInfo({
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
        expiresTime: res.data.data.expiresTime,
      })
      return res.data.data.accessToken
    } else {
      return handleForceLogout(currentPath, '刷新 Token 失败: ' + res.data.msg)
    }
  } catch (error) {
    console.error(error)
    return handleForceLogout(currentPath, '刷新 Token 网络异常或系统错误')
  }
}

// 全局请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    const accessToken = userStore.loginUser.accessToken ?? getAccessTokenUtil()
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    return config
  },

  function (error) {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
axiosInstance.interceptors.response.use(
  async function (response) {
    const { data, config } = response

    // 401：登录过期/未认证
    if (data.code === 401) {
      const currentPath = window.location.pathname + window.location.search

      // 发起或等待刷新请求
      if (!refreshTokenPromise) {
        refreshTokenPromise = handleRefreshToken(currentPath).finally(() => {
          refreshTokenPromise = null
        })
      }

      // 等待刷新结果并重试原请求
      try {
        const newToken = await refreshTokenPromise
        config.headers.Authorization = newToken
        return axiosInstance(config)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    // 403：无权限访问资源（跳转无权限页面）
    if (data.code === 403) {
      if (!window.location.pathname.includes('/auth/unauthorized')) {
        Message.error({ content: '您没有权限执行此操作', offset: [10, 16] })
        router.replace(`${BASE_PATH}/auth/unauthorized`)
      }
      return Promise.reject(new Error('无权限'))
    }

    return response
  },

  // 任何超出 2xx 的 HTTP 响应状态码都会触发该函数
  function (error) {
    return Promise.reject(error)
  },
)

export default axiosInstance
