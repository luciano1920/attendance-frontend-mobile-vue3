<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/components/AppInfiniteList.vue
 * @Description  : 滚动加载列表组件（结合 useInfiniteList 钩子使用）
-->
<template>
  <div
    class="app-infinite-list"
    :class="{
      'is-loading': initLoading,
      'is-empty': dataList.length === 0 && !initLoading,
      'is-has-data': dataList.length > 0,
    }"
  >
    <!-- 空状态 -->
    <div v-if="dataList.length === 0">
      <t-loading v-if="initLoading" text="数据加载中" layout="vertical" theme="dots" size="32px" />
      <t-pull-down-refresh v-else @refresh="handleRefresh">
        <slot name="empty">
          <t-empty description="暂无数据">
            <template #icon>
              <AppSvgIcon name="funnel" size="48px" />
            </template>
          </t-empty>
        </slot>
      </t-pull-down-refresh>
    </div>

    <!-- 列表状态 -->
    <div v-else class="app-infinite-list-content">
      <t-pull-down-refresh @refresh="handleRefresh">
        <t-list :async-loading="scrollLoading" :on-scroll="onScroll">
          <slot name="content" :dataList="dataList"></slot>
        </t-list>
      </t-pull-down-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useInfiniteList,
  type PageParams,
  type PageResult,
  type SearchParams,
} from '@/composables/useInfiniteList'
import AppSvgIcon from './AppSvgIcon.vue'

interface Props {
  fetchMethod: (params: PageParams, signal?: AbortSignal) => Promise<PageResult<any>>
  onError?: (error: any) => void
  searchParams?: SearchParams | (() => SearchParams)
  immediate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true,
  searchParams: () => ({
    pageSize: 10,
  }),
})

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const { dataList, initLoading, scrollLoading, onScroll, onRefresh } = useInfiniteList<any>({
  ...props,
})

const handleRefresh = async () => {
  await onRefresh()
  emit('refresh')
}

defineExpose({
  refresh: onRefresh,
  dataList,
})
</script>

<style scoped lang="scss">
.app-infinite-list {
  .app-infinite-list-content {
    display: flex;
    flex-direction: column;
  }
}
</style>
