/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/composables/usePicker.ts
 * @Description  : 选择器组合式函数
 */
import { reactive } from 'vue'
import type { PickerColumn, PickerValue } from 'tdesign-mobile-vue'

// 选项映射的类型
export type PickerOptionsMap = Record<string, PickerColumn>

// Picker 内部 UI 状态的接口
interface PickerState {
  visible: boolean
  field: string
  title: string
  value: PickerValue[] // 专门给组件库用的数组类型
  options: PickerColumn
}

/**
 * 选择器组合式函数
 * @description 用于管理表单字段的 Picker 选择器状态和交互
 *
 * @param formModel - 表单响应式对象
 * @param optionsMap - 选项映射对象，键为字段名，值为选项列
 */
export const usePicker = <T extends Record<string, any>>(
  formModel: T,
  optionsMap: PickerOptionsMap,
) => {
  const state = reactive<PickerState>({
    visible: false,
    field: '',
    title: '',
    value: [],
    options: [],
  })

  // 打开选择器：field 必须是 T 的键，保证类型安全
  const open = (field: keyof T, title?: string) => {
    state.field = field as string
    state.title = title || '选择'
    state.options = optionsMap[field as string] || []
    state.value = formModel[field] ? [formModel[field]] : [] // 将表单中的单值转为数组
    state.visible = true
  }

  // 确认选择：根据 TDesign 的规范，value 是数组
  const handleConfirm = (value: (string | number)[]) => {
    // 将数组转回单值赋给表单
    if (value && value.length > 0) {
      formModel[state.field as keyof T] = value[0] as T[keyof T]
    } else {
      // 处理清空的情况
      formModel[state.field as keyof T] = '' as T[keyof T]
    }
    state.visible = false
  }

  // 获取显示文本
  const getLabel = (field: keyof T): string => {
    const currentValue = formModel[field]
    // 空值判断（排除 null, undefined, 空字符串）
    if (currentValue === null || currentValue === '' || currentValue === undefined) return ''

    const options = optionsMap[field as string]
    const matchedOption = options?.find((o) => o.value === currentValue)
    return matchedOption?.label || ''
  }

  return {
    state,
    open,
    handleConfirm,
    getLabel,
  }
}
