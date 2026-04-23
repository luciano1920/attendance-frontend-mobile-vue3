<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 10:56
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 10:56
 * @FilePath     : \attendance-frontend-mobile\src\pages\home\components\AttendanceStatistics.vue
 * @Description  : 考勤统计数据卡片组件
-->
<template>
  <div class="attendance-statistics">
    <div v-for="(item, index) in statisticsData" :key="index" class="statistics-item">
      <div class="item-value" :style="{ color: item.color }">{{ item.value }}</div>
      <div class="item-desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface StatisticsItem {
  value: number
  desc?: string
  color?: string
  label?: string
}

interface Props {
  statisticsData: StatisticsItem[]
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.attendance-statistics {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 16px;

  .statistics-item {
    flex: 1 0 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .item-value {
      font-size: 24px;
      font-weight: 600;
    }

    .item-desc {
      font-size: 14px;
      color: #858a99;
    }
  }
}
</style>
