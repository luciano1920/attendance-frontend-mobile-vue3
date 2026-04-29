<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-29 11:06
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-29 11:06
 * @FilePath     : \attendance-frontend-mobile\src\pages\apply\components\MakeupCalendar.vue
 * @Description  :
-->
<template>
  <div class="makeup-calendar">
    <t-calendar
      v-model:visible="calendarVisible"
      type="multiple"
      :min-date="minDate"
      :max-date="maxDate"
      :format="onCalendarDateFormat"
      :confirm-btn="{ theme: 'danger', content: '确认选择' }"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type TCalendarValue } from 'tdesign-mobile-vue'

import { RECORD_TYPE_ENUM } from '@/constants/record'
import { formatDateYMD } from '@/utils/date'

interface Props {
  // 缺卡日期数据
  recordData: any[]
  // 选择后的成功回调
  onConfirm?: (dateList: string[]) => void
}

const props = defineProps<Props>()

// 日历弹窗状态
const calendarVisible = ref<boolean>(false)
const minDate = ref(new Date())
const maxDate = ref(new Date())

const showCalendar = () => {
  calendarVisible.value = true
}

const hideCalendar = () => {
  calendarVisible.value = false
}

/** 计算日历显示的日期区间 */
const calculateDateRange = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // 设置 maxDate 为当月当天
  maxDate.value = new Date(currentYear, currentMonth, now.getDate())

  // 设置 minDate 为上个月1号，如果当前月份是1月(0)，上个月就是去年的12月(11)
  if (currentMonth === 0) {
    minDate.value = new Date(currentYear - 1, 11, 1)
  } else {
    minDate.value = new Date(currentYear, currentMonth - 1, 1)
  }
}

/**
 * 日历组件单元格日期数据格式化回调函数
 * @param dateObj 单元格日期对象
 */
const onCalendarDateFormat = (dateObj?: any) => {
  // 在当月考勤记录中查找当前日期的记录
  const dateStr = formatDateYMD(dateObj.date)
  const record = props.recordData.find((item: any) => item.date === dateStr)

  if (!record) {
    dateObj.type = 'disabled'
    return dateObj
  }

  if (record.recordType === RECORD_TYPE_ENUM.MISSING) {
    dateObj.suffix = '缺卡'
    dateObj.className = 'missing-record'
  }

  return dateObj
}

/**
 * 日历组件确认选择
 * @param date 选择的日期列表
 */
const handleConfirm = (date: TCalendarValue[]) => {
  const selectedDateList = date.map((item: TCalendarValue) => formatDateYMD(item))
  props.onConfirm?.(selectedDateList)
}

onMounted(() => {
  calculateDateRange()
})

defineExpose({
  showCalendar,
  hideCalendar,
})
</script>

<style lang="scss">
.t-popup {
  .t-calendar {
    .t-calendar__dates-item {
      box-sizing: border-box;
      flex-direction: column;
      justify-content: flex-start;
      padding: 5px;
      gap: 5px;
      margin-top: 0;
      height: 50px;
      border-radius: 12px;
    }

    .missing-record {
      color: #d54941;

      .t-calendar__dates-item-suffix {
        color: #d54941;
        font-size: 11px;
        font-weight: 500;
      }
    }

    .t-calendar__dates-item--selected {
      background-color: #fdf3f2;
      outline: 1px solid #d54941;
    }
  }
}
</style>
