<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-30 14:37
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 00:27
 * @FilePath     : \attendance-frontend-mobile\src\pages\approve\components\ApproveInfoCard.vue
 * @Description  : 审批/申请记录列表展示卡片组件
-->
<template>
  <div class="approve-info-card">
    <div class="card-header">
      <div class="header-icon" :style="{ backgroundColor: applyConfig.bgColor }">
        <SvgIcon :name="applyConfig.icon" :color="applyConfig.color" size="24px" />
      </div>

      <div class="header-info">
        <div style="font-size: 14px">
          <span style="font-weight: 600">{{ applyConfig.name }}</span>
          <span style="margin-left: 16px">申请人：罗钧</span>
        </div>
        <div style="color: #858a99; font-size: 12px">2026-03-29 10:32:11</div>
      </div>

      <t-tag variant="light-outline" theme="warning">
        <template #icon>
          <SvgIcon name="clock" size="14px" />
        </template>
        待审批
      </t-tag>
    </div>

    <div class="card-content">家里有事调休一天</div>

    <!-- <t-divider />

    <div class="card-footer">dsad</div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { APPLY_CONFIG_MAP, ApplyTypeEnum } from '@/constants/apply'
import SvgIcon from '@/components/SvgIcon.vue'

const applyType = ref('compOff')

const applyConfig = APPLY_CONFIG_MAP[applyType.value as ApplyTypeEnum]
</script>

<style lang="scss" scoped>
.approve-info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;

    .header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      padding: 4px;
    }

    .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .card-content {
    background-color: #f3f3f4;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    border-radius: 14px;
    font-size: 13px;
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
