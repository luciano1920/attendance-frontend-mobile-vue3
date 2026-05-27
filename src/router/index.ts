import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes,
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
