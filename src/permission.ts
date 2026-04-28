/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 16:38
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-28 16:25
 * @FilePath     : \attendance-frontend-mobile\src\permission.ts
 * @Description  : 全局权限校验核心文件
 */
import { Message } from 'tdesign-mobile-vue'
import router from '@/router'
import { useUserStore } from '@/stores/user-store'

const whiteList = ['/auth/unauthorized', '/tianyiBox'] // 路由白名单

/**
 * @description 全局鉴权路由守卫
 * 1、检查用户是否登录
 * 2、检查用户是否有权限访问该页面
 * @param to 目标路由
 * @param from 来源路由
 * @param next 路由跳转函数 deprecated - 在 Vue Router 4.x 及更高版本中，导航守卫的 next() 回调已被弃用，推荐使用返回值的方式
 */
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const loginUser = userStore.loginUser

  // 如果处于白名单中，则直接放行
  if (whiteList.indexOf(to.path) !== -1) {
    return true
  }

  // 如果用户没有登录，则跳转到登录页面
  if (!loginUser.accessToken) {
    // 如果目标路径不是以/auth开头，则重定向到登录页面
    if (!to.path.startsWith('/auth')) {
      Message.error({ content: '用户未登录，请先登录', offset: [10, 16] })
      return `/auth/portal?redirect=${to.fullPath}`
    }
    // 如果目标路径是/auth开头，则直接放行
    return true
  }

  // 如果用户已登录，则重定向到首页，不需要去任何以/auth开头的页面
  if (to.path.startsWith('/auth')) {
    return '/'
  }

  if (loginUser.accessToken && !loginUser.userInfo.id) {
    await userStore.fetchLoginUserInfo()
  }

  // 其他情况直接放行
  return true
})
