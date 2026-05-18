<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 10:58
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-15 09:19
 * @FilePath     : \attendance-frontend-mobile\src\pages\home\components\AttendanceCalendar.vue
 * @Description  : 考勤日历组件（含图例）
-->
<template>
  <div class="attendance-calendar">
    <t-calendar
      :key="calendarKey"
      :value="currentDate"
      :min-date="minDate"
      :use-popup="false"
      switch-mode="year-month"
      :format="onCalendarDateFormat"
      @panel-change="handlePanelChange"
      @select="handleSelectDay"
    />

    <!-- 考勤类型图例 -->
    <div class="calendar-legend">
      <div v-for="item in statisticsData" :key="item.label" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-text">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { formatDateYMD, isFutureDate } from '@/utils/date'
import { RECORD_TYPE_ENUM } from '@/constants/record'
import type { StatisticsItem } from './AttendanceStatistics.vue'

interface Props {
  recordData: any[]
  statisticsData: StatisticsItem[]
  // 日历 key，用于强制重新渲染
  calendarKey: number
  // 日历当前选择双向绑定的日期，初始化默认为当日
  currentDate: Date
  // 日历的最早日期（必传，不传日历则会默认为当日）
  minDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  minDate: () => new Date(2022, 0, 1),
})

const emit = defineEmits<{
  (e: 'update:current-date', date: Date): void
  (e: 'change-date', date: Date): void
  (e: 'select-day', date: Date): void
}>()

/**
 * 处理日历面板年份/月份切换
 * @param date 日历切换年份/月份时的日期对象，包含 year 和 month
 */
const handlePanelChange = (date: any) => {
  const newDate = new Date(date.year, date.month - 1, 1)
  emit('change-date', newDate)

  // 保持currentDate的日期，只更新年份和月份
  const currentDay = props.currentDate.getDate()
  const updatedDate = dayjs(newDate).date(currentDay).toDate()
  emit('update:current-date', updatedDate)
  emit('select-day', updatedDate)
}

/**
 * 处理日历选择某个日期
 * @param date 日期对象
 */
const handleSelectDay = (date: Date) => {
  emit('select-day', date)
}

/**
 * 日历组件单元格日期数据格式化回调函数
 * @param dateObj 单元格日期对象
 */
const onCalendarDateFormat = (dateObj?: any) => {
  if (isFutureDate(dateObj.date)) {
    dateObj.type = 'disabled'
  }

  // 在当月考勤记录中查找当前日期的记录
  const dateStr = formatDateYMD(dateObj.date)
  const record = props.recordData.find((item: any) => item.date === dateStr)

  if (!record) {
    return dateObj
  }

  // 必须设置 suffix 为空字符串，否则 suffix 插槽不渲染，标记点不显示
  dateObj.suffix = ' '
  dateObj.className = `record-type-${record.recordType}`

  if (record.recordType === RECORD_TYPE_ENUM.NON_WORKDAY) {
    dateObj.type = 'disabled'
  }

  return dateObj
}
</script>

<style lang="scss" scoped>
.attendance-calendar {
  z-index: 10;
  border-radius: 16px;
  background-color: #fff;

  // 图例样式
  .calendar-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    padding-bottom: 12px;
    border-radius: 4px;

    .legend-item {
      font-size: 12px;

      .legend-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .legend-text {
        color: #86909c;
      }
    }
  }
}

:deep(.t-calendar) {
  border-radius: 16px;

  .t-calendar__title {
    display: none;
  }

  .t-calendar-header {
    padding: 8px 16px;
  }

  .t-calendar__days {
    padding: 0 14px;
  }

  .t-calendar__months {
    padding: 8px 12px;
    height: unset;

    .t-calendar__dates {
      grid-column-gap: 0;
    }

    .t-calendar__dates-item {
      box-sizing: border-box;
      flex-direction: column;
      justify-content: flex-start;
      padding: 5px;
      gap: 5px;
      margin-top: 0;
      height: 50px;
      border-radius: 12px;

      .t-calendar__dates-item-suffix {
        position: relative;
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }
    }

    .t-calendar__dates-item--selected {
      background-color: #e8f0fc;
      color: #0052d9;
      outline: 1px solid #0052d9;
    }
  }

  // 用循环生成 7 种类型的标记点样式
  $record-types: 1, 2, 3, 4, 5, 6, 7;
  @each $type in $record-types {
    .record-type-#{$type} {
      .t-calendar__dates-item-suffix {
        background-color: var(--record-color-#{$type});
        color: var(--record-color-#{$type});
      }
    }
  }
}
</style>
