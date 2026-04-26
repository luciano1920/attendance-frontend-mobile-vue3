/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 10:10
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 12:40
 * @FilePath     : \attendance-frontend-mobile\src\constants\record.ts
 * @Description  : 考勤记录相关常量类
 */

/** 考勤记录类型枚举 */
export const RECORD_TYPE_ENUM = {
  NORMAL: 1, // 正常打卡
  MISSING: 2, // 缺卡
  MAKE_UP: 3, // 补卡
  LEAVE: 4, // 请假
  OUTING: 5, // 外出
  REST: 6, // 调休
  NON_WORKDAY: 7, // 非工作日
}

/** 考勤记录类型文本映射 */
export const RECORD_TYPE_MAP: Record<number, string> = {
  1: '正常打卡',
  2: '缺卡',
  3: '补卡',
  4: '请假',
  5: '外出',
  6: '调休',
  7: '非工作日',
}

/** 一周七天文本映射 */
export const RECORD_WEEK_MAP: Record<number, string> = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日',
}

/** 考勤记录类型色值映射 */
export const RECORD_TYPE_COLOR_MAP: Record<number, string> = {
  1: '#0052d9',
  2: '#d54941',
  3: '#e37318',
  4: '#2ba471',
  5: '#2ba471',
  6: '#2ba471',
  7: '#c9cdd4',
}

/** 考勤记录类型选项映射 */
export const RECORD_TYPE_OPTIONS = Object.keys(RECORD_TYPE_MAP).map((key) => {
  const value = Number(key)
  return {
    label: RECORD_TYPE_MAP[value],
    value,
  }
})

/**
 * 考勤统计卡片配置
 * recordTypes: 该统计项关联的 recordType 列表
 * 色值不在此处定义，运行时从 RECORD_TYPE_COLOR_MAP 取第一个 recordType 的色值
 */
export const ATTENDANCE_STATISTICS_CONFIG = [
  { label: '已打卡', desc: '本月打卡', recordTypes: [1] },
  { label: '补卡', desc: '补卡', recordTypes: [3] },
  { label: '缺卡', desc: '缺卡', recordTypes: [2] },
  { label: '其他', desc: '其他', recordTypes: [4, 5, 6] },
  { label: '非工作日', desc: '非工作日', recordTypes: [7] },
]

/**
 * 将 RECORD_TYPE_COLOR_MAP 注入为 CSS 自定义属性
 * 调用后 SCSS 中可通过 var(--record-color-1) ... var(--record-color-7) 使用色值
 * @param el 注入目标元素，默认 document.documentElement（全局生效）
 */
export function recordColorCSSVariables(el: HTMLElement = document.documentElement) {
  Object.entries(RECORD_TYPE_COLOR_MAP).forEach(([type, color]) => {
    el.style.setProperty(`--record-color-${type}`, color)
  })
}
