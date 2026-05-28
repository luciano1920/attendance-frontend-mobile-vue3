/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/permission.ts
 * @Description  : 全局权限校验核心文件
 */
import { storeToRefs } from 'pinia'
import { Message } from 'tdesign-mobile-vue'
import router from '@/router'
import { useUserStore } from '@/stores/user-store'
import { ACCESS_ENUM, ACCESS_WEIGHT, ROLE_ACCESS_MAP } from '@/constants/access'

const AUTH_WHITE_LIST = ['/auth/unauthorized', '/auth/tianyiBox']

/**
 * @description 检查用户是否有权限访问
 * @param loginUser 当前登录用户信息
 * @param needAccess 目标页面所需权限
 * @returns true - 有权限访问，false - 无权限访问
 */
const checkAccess = (loginUser: any, needAccess: string = ACCESS_ENUM.NOT_LOGIN) => {
  const roles = loginUser.userInfo?.roles ?? []
  const needWeight = ACCESS_WEIGHT[needAccess]

  // 不需要登录的页面，直接放行
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }

  // 没有任何角色，视为未登录/无权限
  if (roles.length === 0 || needWeight === undefined) {
    return false
  }

  // 遍历用户角色，判断是否有权限访问
  for (const role of roles) {
    const access = ROLE_ACCESS_MAP[role.code]

    if (!access) {
      continue
    }

    const weight = ACCESS_WEIGHT[access]
    if (weight !== undefined && weight >= needWeight) {
      return true // 权限足够，放行
    }
  }

  return false // 权限不足，不放行
}

/**
 * @description 全局鉴权路由守卫
 * 1、检查用户是否登录
 * 2、检查用户是否有权限访问该页面
 * @param to 目标路由
 * @param from 来源路由
 * @param next 路由跳转函数 deprecated - 在 Vue Router 4.x 及更高版本中，导航守卫的 next() 回调已被弃用，推荐使用返回值 return 的方式
 */
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const { loginUser } = storeToRefs(userStore)

  // ==================== 1. 第一层：白名单直接放行 ====================
  if (AUTH_WHITE_LIST.includes(to.path)) {
    return true
  }

  // ==================== 2. 第二层：旁路补充用户信息（不阻断主流程） ====================
  if (loginUser.value.accessToken && !Array.isArray(loginUser.value.userInfo.roles)) {
    await userStore.fetchLoginUserInfo()
  }

  // 目标页面所需权限等级（默认无需登录）
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN

  // ==================== 3. 第三层：已登录 or 未登录 ====================
  if (loginUser.value.accessToken) {
    // 拦截已登录用户访问认证页（排除无权限页）
    if (
      to.path.startsWith('/auth') &&
      to.path !== '/auth/unauthorized' &&
      to.path !== '/auth/tianyiBox'
    ) {
      return '/'
    }

    // 无需登录的页面直接放行
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
      return true
    }

    // 权限校验
    if (!checkAccess(loginUser.value, needAccess)) {
      Message.error({ content: '您没有权限访问该页面', offset: [10, 16] })
      return '/auth/unauthorized'
    }
  } else {
    // 无需登录的页面直接放行
    if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
      return true
    }

    // 需要权限，但当前处于 /auth 下的公开页面（如登录、注册页本身），放行
    if (to.path.startsWith('/auth')) {
      return true
    }

    // 需要权限且不在公开页面，重定向到登录页
    Message.error({ content: '用户未登录，请先登录', offset: [10, 16] })
    return `/auth/portal?redirect=${encodeURIComponent(to.fullPath)}`
  }
})
