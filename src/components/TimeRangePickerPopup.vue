<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-24 14:28
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-25 14:58
 * @FilePath     : \attendance-frontend-mobile\src\components\TimeRangePickerPopup.vue
 * @Description  : 时间区间选择器 - 弹窗控制器（无头组件）
-->
<template>
  <t-popup v-model="startPickerState.visible" placement="bottom">
    <t-picker
      v-model="startPickerState.value"
      :title="startPickerState.title"
      :columns="startPickerColumns"
      @confirm="(val: Array<PickerValue>, ctx: PickerContext) => handleConfirm(val, ctx, 'start')"
      @pick="(val: Array<PickerValue>, ctx: PickerContext) => handlePick(val, ctx, 'start')"
      @cancel="startPickerState.visible = false"
    />
  </t-popup>

  <t-popup v-model="endPickerState.visible" placement="bottom">
    <t-picker
      v-model="endPickerState.value"
      :title="endPickerState.title"
      :columns="endPickerColumns"
      @confirm="(val: Array<PickerValue>, ctx: PickerContext) => handleConfirm(val, ctx, 'end')"
      @pick="(val: Array<PickerValue>, ctx: PickerContext) => handlePick(val, ctx, 'end')"
      @cancel="endPickerState.visible = false"
    />
  </t-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Toast,
  type PickerColumnItem,
  type PickerContext,
  type PickerValue,
} from 'tdesign-mobile-vue'
import { toTimestamp } from '@/utils/date'
import { formatDateTimeArray, padZero, parseDateTimeToArray } from '@/utils'

interface TimeRangeValue {
  startTime: string | number
  endTime: string | number
}

interface Props {
  modelValue: TimeRangeValue
  startTimeOptions?: PickerColumnItem[]
  endTimeOptions?: PickerColumnItem[]
  disablePast?: boolean // 是否禁用选择过去的时间
}

const props = withDefaults(defineProps<Props>(), {
  startTimeOptions: () => [
    { label: '08:30', value: '08:30' },
    { label: '14:00', value: '14:00' },
  ],
  endTimeOptions: () => [
    { label: '12:00', value: '12:00' },
    { label: '17:30', value: '17:30' },
  ],
  disablePast: false, // 默认可以选择过去的时间
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TimeRangeValue): void
}>()

// 当前日期
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const currentDay = new Date().getDate()
const defaultDate = [String(currentYear), padZero(currentMonth), padZero(currentDay)]

interface PickerState {
  visible: boolean
  title: string
  label: string
  timestamp?: number | null
  value: PickerValue[]
}

// 选择器的状态管理
const startPickerState = reactive<PickerState>({
  visible: false,
  value: [...defaultDate, props.startTimeOptions[0]?.value] as PickerValue[],
  label: '',
  timestamp: null,
  title: '选择开始时间',
})

const endPickerState = reactive<PickerState>({
  visible: false,
  value: [
    ...defaultDate,
    props.endTimeOptions[props.endTimeOptions.length - 1]?.value,
  ] as PickerValue[],
  label: '',
  timestamp: null,
  title: '选择结束时间',
})

// ================= 工具与算法 =================

// 年份选项，如果能选往日，往前推 2 年；如果不能选，只从今年开始。
const startYearOffset = props.disablePast ? 0 : -2
const yearOptions = Array.from({ length: 5 }, (_, index) => ({
  label: `${currentYear + startYearOffset + index}`,
  value: `${currentYear + startYearOffset + index}`,
}))

// 月份选项（生成当前时间及以后年份的月份选项）
const generateMonthOptions = (yearStr: any) => {
  const year = Number(yearStr)

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    return {
      label: padZero(month),
      value: padZero(month),
      // 禁用当前时间之前的月份（只有开启禁用过往时，才计算 disabled）
      disabled: props.disablePast ? year === currentYear && month < currentMonth : false,
    }
  })
}

// 日期选项（生成当前时间及以后年份月份的日期选项）
const generateDayOptions = (yearStr: any, monthStr: any) => {
  const year = Number(yearStr)
  const month = Number(monthStr)
  const daysInMonth = new Date(year, month, 0).getDate()
  // 如果是当年当月，则从当天开始，否则从1号开始
  const startDay =
    props.disablePast && year === currentYear && month === currentMonth ? currentDay : 1

  return Array.from({ length: daysInMonth - startDay + 1 }, (_, index) => ({
    label: padZero(startDay + index),
    value: padZero(startDay + index),
  }))
}

const startMonthOptions = ref(generateMonthOptions(startPickerState.value[0]))
const startDayOptions = ref(
  generateDayOptions(startPickerState.value[0], startPickerState.value[1]),
)
const endMonthOptions = ref(generateMonthOptions(endPickerState.value[0]))
const endDayOptions = ref(generateDayOptions(endPickerState.value[0], endPickerState.value[1]))

// 开始时间选择器选项列
const startPickerColumns = computed(() => [
  yearOptions,
  startMonthOptions.value,
  startDayOptions.value,
  props.startTimeOptions,
])
// 结束时间选择器选项列
const endPickerColumns = computed(() => [
  yearOptions,
  endMonthOptions.value,
  endDayOptions.value,
  props.endTimeOptions,
])

// ================= 暴露给父组件的方法和状态 =================
const openStart = () => {
  // 如果已经有选中的值，根据 label 强制重置 value 和选项列（解决滑动取消后再次打开错乱的问题）
  if (startPickerState.label) {
    const arr = parseDateTimeToArray(startPickerState.label)
    if (arr) {
      startPickerState.value = arr
      startMonthOptions.value = generateMonthOptions(arr[0])
      startDayOptions.value = generateDayOptions(arr[0], arr[1])
    }
  } else {
    // 如果是初次打开（无值），重置为今天的默认值，防止选项残留
    startPickerState.value = [...defaultDate, props.startTimeOptions[0]?.value] as PickerValue[]
    startMonthOptions.value = generateMonthOptions(startPickerState.value[0])
    startDayOptions.value = generateDayOptions(startPickerState.value[0], startPickerState.value[1])
  }
  startPickerState.visible = true
}

const openEnd = () => {
  if (endPickerState.label) {
    const arr = parseDateTimeToArray(endPickerState.label)
    if (arr) {
      endPickerState.value = arr
      endMonthOptions.value = generateMonthOptions(arr[0])
      endDayOptions.value = generateDayOptions(arr[0], arr[1])
    }
  } else {
    endPickerState.value = [
      ...defaultDate,
      props.endTimeOptions[props.endTimeOptions.length - 1]?.value,
    ] as PickerValue[]
    endMonthOptions.value = generateMonthOptions(endPickerState.value[0])
    endDayOptions.value = generateDayOptions(endPickerState.value[0], endPickerState.value[1])
  }
  endPickerState.visible = true
}

// ================= 联动逻辑 =================

/**
 * 根据传入的年月刷新日期选项，并返回修正后的完整 value 数组（纯计算，不修改 state）
 * @param currentValue 当前值数组
 * @param dayOptionsRef 日期选项的引用
 */
const correctStateValue = (currentValue: PickerValue[], dayOptionsRef: typeof startDayOptions) => {
  const newDayOptions = generateDayOptions(currentValue[0], currentValue[1])
  if (!newDayOptions.length) return currentValue

  dayOptionsRef.value = newDayOptions // 只更新选项列表

  const maxDay = newDayOptions[newDayOptions.length - 1]?.value
  const minDay = newDayOptions[0]?.value
  const selectedDay = currentValue[2]
  let fixedDay = selectedDay

  if (maxDay !== undefined && Number(selectedDay) > Number(maxDay)) {
    fixedDay = maxDay
  } else if (minDay !== undefined && Number(selectedDay) < Number(minDay)) {
    fixedDay = minDay
  }

  // 如果日需要修正，返回新数组；否则返回原数组
  return fixedDay !== selectedDay
    ? [currentValue[0], currentValue[1], fixedDay, currentValue[3]]
    : currentValue
}

/**
 * 处理选择器的选择事件
 * @param value 选择的值
 * @param context 选择项的包含内容
 * @param type 选择器的类型，'start' 或 'end'
 */
const handlePick = (value: Array<PickerValue>, context: PickerContext, type: 'start' | 'end') => {
  const pickerState = type === 'start' ? startPickerState : endPickerState
  const monthOptionsRef = type === 'start' ? startMonthOptions : endMonthOptions
  const dayOptionsRef = type === 'start' ? startDayOptions : endDayOptions

  let finalValue = [...value]

  // 处理年份切换时的月份禁用修正
  if (context.column === 0) {
    const newMonthOptions = generateMonthOptions(value[0])
    monthOptionsRef.value = newMonthOptions

    // 检查当前选中的月份，在新年份下是否变成了 disabled（在开启禁用状态下）
    if (props.disablePast) {
      const selectedMonth = newMonthOptions.find((m) => m.value === value[1])
      if (selectedMonth?.disabled) {
        finalValue[1] = padZero(currentMonth)
      }
    }
  }

  // 刷新日选项并修正日（如果年月变化导致日越界）
  if (context.column === 0 || context.column === 1) {
    finalValue = correctStateValue(finalValue, dayOptionsRef) as PickerValue[]
  }

  pickerState.value = finalValue
}

/**
 * 处理选择器的确认事件
 * @param value 选择的值
 * @param context 选择项的包含内容
 * @param type 选择器的类型，'start' 或 'end'
 */
const handleConfirm = (
  value: Array<PickerValue>,
  context: PickerContext,
  type: 'start' | 'end',
) => {
  const pickerState = type === 'start' ? startPickerState : endPickerState
  const dayOptionsRef = type === 'start' ? startDayOptions : endDayOptions

  // 1. 月份禁用检查并修正
  const newMonthOptions = generateMonthOptions(value[0])
  const isMonthDisabled =
    props.disablePast && newMonthOptions.find((m) => m.value === value[1])?.disabled
  const correctedMonth = isMonthDisabled ? padZero(currentMonth) : value[1]

  // 2. 构建初始正确的数组（年、修正后的月、日、时间）
  let finalValue = [value[0], correctedMonth, value[2], value[3]] as PickerValue[]

  // 3. 刷新日选项并修正日
  finalValue = correctStateValue(finalValue, dayOptionsRef) as PickerValue[]
  pickerState.value = finalValue

  // 4. 格式化最终值
  const formattedText = formatDateTimeArray(pickerState.value)

  if (type === 'start') {
    const startTs = toTimestamp(formattedText)
    const endTs = toTimestamp(endPickerState.label)
    // 如果开始时间大于等于结束时间，自动调整结束时间，将结束时间设置为同一天的默认结束时间
    if (endTs && startTs >= endTs) {
      const resetEndValue = [
        pickerState.value[0],
        pickerState.value[1],
        pickerState.value[2],
        props.endTimeOptions[props.endTimeOptions.length - 1]?.value,
      ] as PickerValue[]

      // 先刷新结束时间的月份和日期选项
      endMonthOptions.value = generateMonthOptions(pickerState.value[0])
      endDayOptions.value = generateDayOptions(pickerState.value[0], pickerState.value[1])

      // 同步更新结束时间的月份和日期选项
      endPickerState.value = resetEndValue
      endPickerState.label = formatDateTimeArray(resetEndValue)
      endPickerState.timestamp = toTimestamp(endPickerState.label)

      Toast({
        theme: 'success',
        direction: 'column',
        message: '结束时间已自动调整',
      })
    }

    // 保存开始时间状态并关闭弹窗
    startPickerState.label = formattedText
    startPickerState.visible = false
    startPickerState.timestamp = toTimestamp(formattedText)
  }

  if (type === 'end') {
    const startTs = toTimestamp(startPickerState.label)
    const endTs = toTimestamp(formattedText)
    // 如果结束时间小于等于开始时间，显示警告并阻止确认
    if (startTs && endTs && endTs <= startTs) {
      Toast({
        theme: 'warning',
        direction: 'column',
        message: '结束时间必须晚于开始时间',
      })
      return
    }

    // 如果校验通过，格式化并保存结束时间
    endPickerState.label = formattedText
    endPickerState.visible = false
    endPickerState.timestamp = toTimestamp(formattedText)
  }

  emit('update:modelValue', {
    startTime: startPickerState.timestamp ?? 0,
    endTime: endPickerState.timestamp ?? 0,
  })
}

defineExpose({
  startText: computed(() => startPickerState.label),
  endText: computed(() => endPickerState.label),
  openStart,
  openEnd,
})
</script>
