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

    <div v-if="deviceDataList.length === 0">
      <t-loading
        text="数据加载中"
        layout="vertical"
        theme="dots"
        size="32px"
        :loading="initLoading"
      />

      <t-pull-down-refresh v-if="!initLoading" @refresh="handleRefresh">
        <t-empty description="暂无数据">
          <template #icon>
            <AppSvgIcon name="funnel" size="48px" />
          </template>
        </t-empty>
      </t-pull-down-refresh>
    </div>

    <div v-else class="device-list">
      <t-pull-down-refresh @refresh="handleRefresh">
        <t-list :async-loading="scrollStatus" :on-scroll="handleScroll">
          <div v-for="deviceItem in deviceDataList" :key="deviceItem.id" class="list-card-wrapper">
            <DeviceListCard :device="deviceItem" />
          </div>
        </t-list>
      </t-pull-down-refresh>
    </div>

    <!-- 列表一键返回顶部 -->
    <AppBackListTop text="顶部" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message, type ListProps } from 'tdesign-mobile-vue'

import { listMachineInfoByPageUsingGet } from '@/api/machine-controller.ts'
import AppSvgIcon from '@/components/AppSvgIcon.vue'
import AppBackListTop from '@/components/AppBackListTop.vue'
import DeviceListCard from './components/DeviceListCard.vue'

const router = useRouter()

const isFetching = ref(false) // 请求锁：防止并发请求
const isFinished = ref(false) // 截断锁：数据到底 or 接口报错，停止滚动加载

const initLoading = computed(() => isFetching.value && searchParams.pageNo === 1)
const scrollStatus = computed<ListProps['asyncLoading']>(() => {
  if (isFetching.value && searchParams.pageNo > 1) {
    return 'loading'
  }
  return ''
})

// 查询参数
const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
})

const listTotal = ref<number>(0)
const deviceDataList = ref<any[]>([]) // 申请记录数据列表

let abortController: AbortController | null = null

/** 获取申请记录数据列表 */
const getDeviceDataList = async () => {
  // 如果存在未完成的上一次请求，直接取消它
  if (abortController) {
    abortController.abort()
  }
  const currentController = new AbortController() // 每次发起新请求，都创建一个新的 AbortController 实例
  abortController = currentController

  // 发请求开始就加上请求锁
  isFetching.value = true

  try {
    const res = await listMachineInfoByPageUsingGet(
      { ...searchParams },
      { signal: currentController.signal },
    )

    if (res.data.code === 0 && res.data.data) {
      const newList = res.data.data.list ?? []
      if (searchParams.pageNo === 1) {
        deviceDataList.value = newList // 如果是第一页，直接替换；否则追加数据
      } else {
        deviceDataList.value = [...deviceDataList.value, ...newList]
      }
      listTotal.value = res.data.data.total ?? 0

      // 如果当前数据量 >= 分页总量，上截断锁
      if (deviceDataList.value.length >= listTotal.value) {
        isFinished.value = true
      }
    } else {
      Message.error({ content: '获取记录失败，' + res.data.msg, offset: [10, 16] })
      // 如果获取数据失败，也要上截断锁
      isFinished.value = true
    }
  } catch (error: any) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return
    }

    Message.error({ content: '网络异常，请稍后重试', offset: [10, 16] })
    console.log(error)

    // 如果获取数据失败，也要上截断锁
    isFinished.value = true
  } finally {
    if (!currentController?.signal.aborted) {
      isFetching.value = false // 无论成功失败，只解请求锁
    }
    abortController = null // 断开引用，防止闭包导致内存泄漏
  }
}

/**
 * 处理列表滑动事件
 * @param scrollBottom 滚动条距离底部的距离
 */
const handleScroll = (scrollBottom: number) => {
  // 只有触底，且没在加载，且没被截断，才允许请求下一页
  if (scrollBottom < 1 && !isFetching.value && !isFinished.value) {
    searchParams.pageNo += 1
    getDeviceDataList()
  }
}

/** 处理列表下拉刷新 */
const handleRefresh = () => {
  searchParams.pageNo = 1
  deviceDataList.value = []
  listTotal.value = 0
  // 下拉刷新时，打开截断锁
  isFinished.value = false
  getDeviceDataList()
}

onMounted(() => {
  getDeviceDataList()
})
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 16px 96px;

  .list-card-wrapper {
    margin-bottom: 10px;
  }
}
</style>
