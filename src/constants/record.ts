/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 10:10
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-08 09:08
 * @FilePath     : \attendance-frontend-mobile\src\constants\record.ts
 * @Description  : 考勤记录相关常量类
 */

import type { ThemeType } from '@/components/IconContainer.vue'

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
  1: '星期日',
  2: '星期一',
  3: '星期二',
  4: '星期三',
  5: '星期四',
  6: '星期五',
  7: '星期六',
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

/** 申请类型枚举 */
export const APPLY_TYPE_ENUM = {
  LEAVE: '请假', // 请假
  OUTING: '外出', // 外出
  MAKE_UP: '补卡', // 补卡
  REST: '调休', // 调休
  FACE_UPDATE: '人脸', // 人脸变更
}

/** 申请类型文本映射 */
export const APPLY_TYPE_MAP: Record<number, string> = {
  1: '请假',
  2: '外出',
  3: '补卡',
  4: '调休',
  5: '人脸',
}

/** 图标配置类型 */
interface IconConfig {
  icon: string
  theme: ThemeType
}

export const APPLY_ICON_MAP: Record<string, IconConfig> = {
  [APPLY_TYPE_ENUM.LEAVE]: { icon: 'coffee', theme: 'blue' },
  [APPLY_TYPE_ENUM.OUTING]: { icon: 'plane', theme: 'orange' },
  [APPLY_TYPE_ENUM.MAKE_UP]: { icon: 'calendar-plus', theme: 'red' },
  [APPLY_TYPE_ENUM.REST]: { icon: 'moon', theme: 'green' },
  [APPLY_TYPE_ENUM.FACE_UPDATE]: { icon: 'scan-face', theme: 'purple' },
}

export const APPROVE_STATUS_ENUM = {
  PENDING: 0, // 待审批
  APPROVED: 1, // 已通过
  REJECTED: 2, // 已驳回
}

export const APPROVE_STATUS_MAP: Record<number, string> = {
  0: '待审批',
  1: '已审批',
  2: '已驳回',
}

export const APPROVE_TAG_MAP: Record<number, any> = {
  [APPROVE_STATUS_ENUM.PENDING]: { icon: 'clock', theme: 'warning' },
  [APPROVE_STATUS_ENUM.APPROVED]: { icon: 'check-circle', theme: 'success' },
  [APPROVE_STATUS_ENUM.REJECTED]: { icon: 'close-circle', theme: 'danger' },
}
