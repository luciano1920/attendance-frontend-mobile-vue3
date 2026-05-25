<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-03-30 23:21
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-25 16:05
 * @FilePath     : \attendance-frontend-mobile\src\pages\home\HomePage.vue
 * @Description  : 系统首页
-->
<template>
  <div id="home-page">
    <!-- 顶部用户信息栏 -->
    <div class="user-info-bar">
      <!-- 用户头像 -->
      <img :src="loginUserInfo.avatar || defaultAvatar" class="user-avatar" alt="avatar" />
      <!-- 用户简要信息 -->
      <div class="user-desc">
        <div class="user-name">{{ loginUserInfo.username }}</div>
        <div class="user-role">
          <SvgIcon name="map-pin" size="12px" style="margin-right: 4px" />
          <span>{{ loginUserInfo.dept?.name }}</span>
        </div>
      </div>

      <t-button size="small" variant="outline" class="system-rule" @click="router.push('/rules')">
        <SvgIcon name="file-text" />
        帮助手册
      </t-button>
    </div>

    <!-- 考勤统计数据卡片 -->
    <AttendanceStatistics :statistics-data="statisticsData" />

    <!-- 考勤日历 -->
    <AttendanceCalendar
      v-model:current-date="currentDate"
      :calendar-key="calendarKey"
      :record-data="recordMonthData"
      :statistics-data="statisticsData"
      @change-date="getAttendanceRecordDataByMonth"
      @select-day="getAttendanceRecordDataByDay"
    />

    <!-- 考勤数据信息展示卡片 -->
    <AttendanceInfo :record-data="recordDayData" />
  </div>
</template>

<script setup lang="ts">
import { Message } from 'tdesign-mobile-vue'
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { fetchRecordByDayUsingPost, fetchRecordByMonthUsingPost } from '@/api/record-controller'
import { useUserStore } from '@/stores/user-store'
import { isFutureDate, toTimestamp } from '@/utils/date'
import {
  ATTENDANCE_STATISTICS_CONFIG,
  RECORD_TYPE_COLOR_MAP,
  recordColorCSSVariables,
} from '@/constants/record'
import defaultAvatar from '@/assets/svgs/home-avatar.svg'
import SvgIcon from '@/components/SvgIcon.vue'

import AttendanceCalendar from './components/AttendanceCalendar.vue'
import AttendanceInfo from './components/AttendanceInfo.vue'
import AttendanceStatistics, { type StatisticsItem } from './components/AttendanceStatistics.vue'

const router = useRouter()
const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

const statisticsData = ref<StatisticsItem[]>(
  ATTENDANCE_STATISTICS_CONFIG.map((item) => ({
    value: 0,
    desc: item.desc,
    label: item.label,
    color: RECORD_TYPE_COLOR_MAP[item.recordTypes[0] || 0], // 同组 recordTypes 色值一致，取第一个即可
  })),
)

// 日历当前选择双向绑定的日期，初始化默认为当日
const currentDate = ref(new Date())
// 日历 key，用于强制重新渲染
const calendarKey = ref(0)

// 当月考勤数据
const recordMonthData = ref<any[]>([])
// 当日考勤数据
const recordDayData = ref<any>({})

/**
 * 获取当月考勤数据
 * @param date 日期对象
 */
const getAttendanceRecordDataByMonth = async (date: Date) => {
  recordDayData.value = {}
  recordMonthData.value = []

  if (!date || isFutureDate(date)) {
    return
  }

  const res = await fetchRecordByMonthUsingPost({ month: toTimestamp(date) })
  if (res.data.code === 0 && res.data.data) {
    // 计算非工作日的天数
    const noWorkDays =
      res.data.data.transactionList?.filter((item: any) => item.recordType === 7).length || 0
    statisticsData.value[4]!.value = noWorkDays // 非工作日

    const totalDays = res.data.data.transactionList?.length || 0

    statisticsData.value[0]!.value = res.data.data.dk || 0 // 本月打卡
    statisticsData.value[1]!.value = res.data.data.bk || 0 // 补卡
    statisticsData.value[2]!.value = res.data.data.qk || 0 // 缺卡
    statisticsData.value[3]!.value =
      totalDays -
      noWorkDays -
      statisticsData.value[0]!.value -
      statisticsData.value[1]!.value -
      statisticsData.value[2]!.value

    // 更新本地的当月考勤数据
    recordMonthData.value = res.data.data.transactionList ?? []

    // 数据更新后，改变 key 强制日历重新渲染
    await nextTick()
    calendarKey.value++
  } else {
    Message.error({
      content: res.data.msg || '获取月度考勤数据失败',
      offset: [10, 16],
    })
    recordMonthData.value = []
  }
}

/**
 * 获取当日考勤数据
 * @param date 日期对象
 */
const getAttendanceRecordDataByDay = async (date: Date) => {
  recordDayData.value = {}

  if (!date || isFutureDate(date)) {
    return
  }

  const res = await fetchRecordByDayUsingPost({ day: toTimestamp(date) })
  if (res.data.code === 0 && res.data.data) {
    recordDayData.value = res.data.data
  } else {
    Message.error({
      content: res.data.msg || '获取当日考勤数据失败',
      offset: [10, 16],
    })
    recordDayData.value = {}
  }
}

onMounted(() => {
  recordColorCSSVariables()
  getAttendanceRecordDataByMonth(currentDate.value)
  getAttendanceRecordDataByDay(currentDate.value)
})
</script>

<style lang="scss" scoped>
#home-page {
  padding: 24px 16px 96px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #c4c6cd;
    padding: 1px;
  }

  .user-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .user-name {
      font-size: 18px;
      font-weight: 600;
      color: #171a1d;
    }

    .user-role {
      font-size: 13px;
      color: #86909c;
    }
  }

  .system-rule {
    color: #0052d9;
    background-color: #fff;
    --td-button-border-radius: 12px;
    font-weight: 500;
  }
}
</style>
