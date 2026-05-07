/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-05-07 16:31
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-07 16:49
 * @FilePath     : \attendance-frontend-mobile\src\composables\useFilterCache.ts
 * @Description  : 页面筛选状态缓存组合式函数
 */
import { onBeforeRouteLeave, type RouteLocationNormalized } from 'vue-router'

/**
 * 页面筛选状态缓存（通用）
 * @description 用于在页面间缓存和恢复筛选状态，当离开页面时根据条件决定是否缓存当前状态，返回页面时可以恢复之前保存的状态。

 * @param options - 配置选项对象
 * @param options.key - 缓存键名，不同页面必须使用不同的键名以避免冲突
 * @param options.shouldCache - 离开页面时的判断函数，返回 true 时写入缓存，返回 false 时清除残留缓存
 * @param options.state - 获取当前需要缓存的状态快照的函数，使用函数形式确保能取到最新值
 * @param options.onRestore - 恢复缓存时的回调函数，接收保存的状态作为参数
 */
export const useFilterCache = <T extends Record<string, any>>(options: {
  key: string
  shouldCache: (to: RouteLocationNormalized) => boolean
  state: () => T
  onRestore: (state: T) => void
}) => {
  const { key, shouldCache, state, onRestore } = options

  onBeforeRouteLeave((to) => {
    // 如果目标路由符合则缓存筛选状态，否则清除残留缓存
    if (shouldCache(to)) {
      sessionStorage.setItem(key, JSON.stringify(state()))
    } else {
      sessionStorage.removeItem(key)
    }
  })

  /** 尝试恢复缓存，返回是否恢复成功 */
  function restore(): boolean {
    const raw = sessionStorage.getItem(key)
    if (!raw) return false

    try {
      onRestore(JSON.parse(raw) as T)
      return true
    } catch {
      return false
    } finally {
      // 用完即清，无论成功失败都不留残留
      sessionStorage.removeItem(key)
    }
  }

  return { restore }
}
