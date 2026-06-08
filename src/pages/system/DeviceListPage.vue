<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/DeviceListPage.vue
 * @Description  : 打卡设备列表页
-->
<template>
  <div id="device-list-page">
    <div class="nav-bar" @click="router.push('/profile')">
      <AppSvgIcon name="chevron-left" size="22px" />
      打卡设备
    </div>

    <AppInfiniteList :fetch-method="getDevicesList" :on-error="handleError" class="device-list">
      <template #content="{ dataList }">
        <div v-for="item in dataList" :key="item.id" class="list-card-wrapper">
          <DeviceListCard :device="item" />
        </div>
      </template>
    </AppInfiniteList>

    <!-- 列表一键返回顶部 -->
    <AppBackListTop text="顶部" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { listMachineInfoByPageUsingGet } from '@/api/machine-controller.ts'
import type { PageParams } from '@/composables/useInfiniteList.ts'
import AppBackListTop from '@/components/AppBackListTop.vue'
import AppInfiniteList from '@/components/AppInfiniteList.vue'
import AppSvgIcon from '@/components/AppSvgIcon.vue'
import DeviceListCard from './components/DeviceListCard.vue'

const router = useRouter()

/**
 * 获取打卡设备列表数据
 * @param params 分页参数
 * @param signal 请求取消信号
 */
const getDevicesList = async (params: PageParams, signal?: AbortSignal) => {
  const res = await listMachineInfoByPageUsingGet({ ...params }, { signal })
  if (res.data.code !== 0) {
    throw new Error('获取记录失败，' + res.data.msg)
  }

  return {
    list: res.data.data.list ?? [],
    total: res.data.data.total ?? 0,
  }
}

/**
 * 请求失败统一处理
 * @param error 错误信息
 */
const handleError = (error: any) => {
  Message.error({
    content: error.message ?? '网络异常，请稍后重试',
    offset: [10, 16],
  })
}
</script>

<style scoped lang="scss">
.nav-bar {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
}

.device-list {
  padding: 8px 16px 96px;

  .list-card-wrapper {
    margin-bottom: 10px;
  }
}
</style>
