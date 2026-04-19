/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-19 17:07
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-20 15:42
 * @FilePath     : \attendance-frontend-mobile\src\router\index.ts
 * @Description  :
 */
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes
})

/**
 * @description 路由守卫：动态设置页面标题
 * @param to 路由跳转目标
 */
router.beforeEach((to: RouteLocationNormalized) => {
  const title = to.meta.title as string
  const siteName = import.meta.env.VITE_APP_TITLE
  document.title = title ? `${title} - ${siteName}` : siteName
})

export default router
