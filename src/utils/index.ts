/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/utils/index.ts
 * @Description  : 通用工具函数
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

/**
 * 补零工具方法：将 1-9 转换为 '01'-'09'
 * @param num 需要补零的数字
 * @returns 补零后的字符串，如 '01', '09', '10'
 */
export const padZero = (num: number | string): string => {
  return String(num).padStart(2, '0')
}

/**
 * 格式化日期时间数组为 YYYY-MM-DD HH:mm
 * @param dateArr 日期时间数组，格式为 [year, month, day, time]
 * @returns 格式化后的日期时间字符串
 * @throws 当数组长度不足4或包含空值时抛出错误
 */
export const formatDateTimeArray = (dateArr: (string | number)[]): string => {
  if (!Array.isArray(dateArr) || dateArr.length < 4) {
    throw new Error('dateArray 必须是包含至少4个元素的数组')
  }

  const [year, month, day, time] = dateArr

  if ([year, month, day, time].some((item) => item === undefined || item === null || item === '')) {
    throw new Error('dateArray 不能包含空值')
  }

  return `${year}-${month}-${day} ${time}`
}

/**
 * 将日期时间字符串（如 "2026-04-24 14:30"）转换为数组格式（如 ["2026", "04", "24", "14:30"]）
 * @param dateStr 日期时间字符串，格式为 "YYYY-MM-DD HH:mm"
 * @returns 转换后的数组 [year, month, day, time]，格式不正确时返回 null
 */
export const parseDateTimeToArray = (dateStr: string): string[] | null => {
  if (!dateStr) return null

  const [datePart, timePart] = dateStr.split(' ')
  if (!datePart || !timePart) return null

  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return null

  return [year, month, day, timePart]
}
