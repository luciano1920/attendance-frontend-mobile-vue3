<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/components/DeviceListCard.vue
 * @Description  : 打卡机设备列表卡片展示组件
-->
<template>
  <div class="device-list-card">
    <IconContainer icon="server" theme="blue" />
    <div class="list-card-content">
      <div class="list-item-title">{{ device?.address }}</div>
      <div class="list-item-alias">打卡机别名：{{ device?.alias }}</div>
      <div class="list-item-code">打卡机编号：{{ device?.sn }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconContainer from '@/components/IconContainer.vue'

interface Props {
  device: any
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.device-list-card {
  display: flex;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px 12px;
  gap: 12px;

  .list-card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;

    .list-item-title {
      color: #171a1d;
      font-size: 14px;
      font-weight: 600;
    }

    .list-item-alias {
      color: #4e5969;
      font-size: 12px;
    }

    .list-item-code {
      color: #86909c;
      font-size: 12px;
    }
  }
}
</style>
