<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 11:03
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-08 09:22
 * @FilePath     : \attendance-frontend-mobile\src\pages\home\components\AttendanceInfo.vue
 * @Description  : 当日考勤打卡记录详情展示组件
-->
<template>
  <div class="attendance-info">
    <div class="info-header">
      <div class="info-date">{{ formatDateCN(recordData.date) }}</div>
      <div class="info-week">{{ RECORD_WEEK_MAP[recordData.week] }}</div>
      <t-tag v-if="recordData.transactionList?.length !== 0" variant="light" theme="primary">
        已打卡
      </t-tag>
      <t-tag
        v-else-if="recordData.transactionList?.length === 0 && recordData.typeList?.length === 0"
        variant="light"
        theme="danger"
      >
        缺卡
      </t-tag>
    </div>

    <div class="info-type-list">
      <t-tag
        v-if="recordData.typeList?.length !== 0"
        v-for="typeItem in recordData.typeList"
        :key="typeItem"
        variant="light"
        theme="success"
      >
        {{ typeItem.type }}({{ typeItem.period }})
      </t-tag>
    </div>

    <div class="info-item" v-for="item in recordData.transactionList" :key="item.time">
      <div class="info-item-dot"></div>
      <div class="info-item-name">上班打卡</div>
      <div class="info-item-desc">
        <div class="info-item-time">{{ formatTime(item.time) }}</div>
        <div class="info-item-address">{{ item.address }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RECORD_WEEK_MAP } from '@/constants/record'
import { formatDateCN, formatTime } from '@/utils/date'

interface Props {
  recordData: any
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.attendance-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  padding: 12px 16px;
  gap: 2px;
  border-radius: 16px;

  .info-header {
    display: flex;
    gap: 12px;
    padding: 4px 8px;
    align-items: center;
    justify-content: center;

    .info-date {
      font-weight: 600;
    }

    .info-week {
      font-weight: 600;
    }
  }

  .info-type-list {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    align-items: center;
    padding: 6px 8px;

    &:not(:last-child) {
      padding: 10px;
      border-bottom: 1px solid #f1f1f1;
    }

    .info-item-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
      background-color: #0052d9;
    }

    .info-item-name {
      font-size: 14px;
      color: #4e5969;
    }

    .info-item-desc {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .info-item-time {
        font-size: 14px;
        color: #171a1d;
        font-weight: 600;
      }

      .info-item-address {
        font-size: 12px;
        color: #86909c;
      }
    }
  }
}
</style>
