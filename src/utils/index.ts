/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-27 10:04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-04-01 09:15
 * @FilePath     : \attendance-frontend-mobile\src\utils\index.ts
 * @Description  : 工具函数
 */

/**
 * 获取当前页面 URL 中的查询参数（即 ? 后的部分）
 * @returns {Object} 包含所有查询参数的对象，键和值均为字符串；若无参数则返回空对象
 */
export const getUrlQueryParamsUtil = (): Record<string, string> => {
  const search = window.location.search
  if (!search) return {}

  const params = new URLSearchParams(search)
  const result: Record<string, string> = {}

  params.forEach((value, key) => {
    result[key] = value
  })

  return result
}
