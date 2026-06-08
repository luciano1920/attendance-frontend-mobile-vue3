<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/record/RecordPage.vue
 * @Description  : 审批/申请记录列表页
-->
<template>
  <div id="record-page">
    <div class="record-page-header">
      <t-navbar :fixed="false" :title="pageTitle" />
      <div class="filter-bar">
        <t-tabs v-model="approvalStatus" :space-evenly="false" @change="handleTabChange">
          <t-tab-panel value="pending" label="待审批" />
          <t-tab-panel value="completed" label="已审批" />
        </t-tabs>

        <AppSegmented
          v-if="showSegmented"
          v-model:value="searchParams.checkManage"
          :options="segmentOptions"
          shape="round"
        >
          <template #label="{ label, payload }">
            <AppSvgIcon :name="payload.icon" />
            <span style="margin-left: 4px">{{ label }}</span>
          </template>
        </AppSegmented>
      </div>

      <div v-if="isBatchMode" class="batch-action-bar">
        <div class="batch-action-left">
          <t-button variant="text" theme="default" size="extra-small" @click="exitBatchMode">
            取消
          </t-button>

          <t-checkbox
            :checked="isAllSelected"
            label="全选"
            borderless
            @change="handleCheckAllChange"
          />
        </div>

        <div class="batch-action-right">
          <span class="selected-count">已选 {{ batchRecordIds.length }} 项</span>
          <t-button
            theme="danger"
            size="extra-small"
            variant="text"
            :disabled="batchRecordIds.length === 0"
            @click="handleBatchApprove(APPROVE_STATUS_ENUM.REJECTED)"
          >
            批量驳回
          </t-button>
          <t-button
            theme="primary"
            size="extra-small"
            variant="text"
            :disabled="batchRecordIds.length === 0"
            @click="handleBatchApprove(APPROVE_STATUS_ENUM.APPROVED)"
          >
            批量通过
          </t-button>
        </div>
      </div>
    </div>

    <AppInfiniteList
      ref="infiniteListRef"
      class="record-list"
      :class="{ 'is-batch-mode': isBatchMode }"
      :search-params="searchParams"
      :fetch-method="getApplyRecordList"
      :on-error="handleError"
      @refresh="exitBatchMode"
    >
      <template #content="{ dataList }">
        <t-checkbox-group v-model:value="batchRecordIds" borderless>
          <div v-for="recordItem in dataList" :key="recordItem.id" class="list-card-wrapper">
            <!-- 批量模式下 -->
            <template v-if="isBatchMode">
              <div
                class="batch-card"
                :class="{ 'batch-card--active': batchRecordIds.includes(recordItem.id) }"
              >
                <AppSvgIcon
                  v-if="batchRecordIds.includes(recordItem.id)"
                  class="batch-card-check-icon"
                  name="check"
                  color="#ffffff"
                />
                <t-checkbox
                  :value="recordItem.id"
                  icon="none"
                  style="position: absolute; opacity: 0"
                />
                <div class="batch-card-content">
                  <RecordListCard
                    :record="recordItem"
                    :is-approve-view="searchParams.checkManage"
                  />
                </div>
              </div>
            </template>

            <!-- 普通模式下 -->
            <template v-else>
              <RecordListCard
                :record="recordItem"
                :is-approve-view="searchParams.checkManage"
                @long-press="enterBatchMode(recordItem.id)"
              />
            </template>
          </div>
        </t-checkbox-group>
      </template>
    </AppInfiniteList>

    <!-- 列表一键返回顶部 -->
    <AppBackListTop text="顶部" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Message, type TabValue } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { useFilterCache } from '@/composables/useFilterCache'
import type { PageParams } from '@/composables/useInfiniteList.ts'
import {
  approveApplicationUsingPost,
  fetchApprovalRecordByPageUsingPost,
} from '@/api/approve-controller'
import { ACCESS_ENUM, getUserAccessLevel } from '@/constants/access'
import { APPROVE_STATUS_ENUM } from '@/constants/record'

import AppSvgIcon from '@/components/AppSvgIcon.vue'
import AppSegmented from '@/components/AppSegmented.vue'
import AppBackListTop from '@/components/AppBackListTop.vue'
import AppInfiniteList from '@/components/AppInfiniteList.vue'
import RecordListCard from './components/RecordListCard.vue'

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

// ==================== 页面基础状态和筛选条件 ====================
const pageTitle = ref<string>('申请记录')

const approvalStatus = ref<string>('pending') // 审批状态，绑定 TabValue
// 分段控制选项，用于区分个人申请清单还是管理员审批清单
const showSegmented = ref<boolean>(false) // 管理员角色才能看到分段控制器
const segmentOptions = [
  { label: '审批', value: true, payload: { icon: 'check-check' } },
  { label: '我的申请', value: false, payload: { icon: 'list' } },
]

const infiniteListRef = ref()

// 查询参数
const searchParams = reactive({
  pageSize: 10,
  orderState: [APPROVE_STATUS_ENUM.PENDING],
  checkManage: false,
})

// ==================== 获取列表数据 ====================
/**
 * 获取申请列表数据
 * @param params 分页参数
 * @param signal 请求取消信号
 */
const getApplyRecordList = async (params: PageParams, signal?: AbortSignal) => {
  const res = await fetchApprovalRecordByPageUsingPost({ ...params }, { signal })
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

/**
 * Tab 切换事件处理函数
 * @param value 选中的 Tab
 */
const handleTabChange = (value: TabValue) => {
  if (value === 'pending') {
    searchParams.orderState = [APPROVE_STATUS_ENUM.PENDING]
  } else {
    searchParams.orderState = [APPROVE_STATUS_ENUM.APPROVED, APPROVE_STATUS_ENUM.REJECTED]
  }
}

// ========== 批量操作 ==========
const isBatchMode = ref<boolean>(false) // 是否处于批量操作模式
const batchRecordIds = ref<Array<number>>([]) // 批量操作的记录 id 列表

// 是否全选
const isAllSelected = computed(() => {
  const currentList = infiniteListRef.value?.dataList || []
  if (currentList.length === 0) {
    return false
  }
  return currentList.every((item: any) => batchRecordIds.value.includes(item.id))
})

/**
 * 进入批量模式（默认选中触发项）
 * @param id 当前记录 id
 */
const enterBatchMode = (id: number) => {
  if (!(approvalStatus.value === 'pending' && searchParams.checkManage)) {
    return
  }
  isBatchMode.value = true
  batchRecordIds.value = [id] // 清空并只选当前
}

/** 退出批量模式 */
const exitBatchMode = () => {
  isBatchMode.value = false
  batchRecordIds.value = []
}

/**
 * 全选按钮的 change
 * @param checked 是否全选
 */
const handleCheckAllChange = (checked: boolean) => {
  const currentList = infiniteListRef.value?.dataList || []
  batchRecordIds.value = checked ? currentList.map((item: any) => Number(item.id)) : []
}

/**
 * 处理批量审批
 * @param state 审批状态
 */
const handleBatchApprove = async (state: number) => {
  if (batchRecordIds.value.length === 0) {
    return
  }

  const res = await approveApplicationUsingPost({
    id: batchRecordIds.value,
    orderState: state,
  })
  if (res.data.code === 0) {
    Message.success({ content: '批量处理成功', offset: [10, 16] })
    exitBatchMode()
    // 刷新列表
    infiniteListRef.value?.refresh()
  } else {
    Message.error({ content: '批量处理失败，' + res.data.msg, offset: [10, 16] })
  }
}

// ==================== 路由缓存 ====================
const filterCache = useFilterCache({
  key: 'record_page_filter_state',
  shouldCache: (to) => to.path.startsWith('/record/'),
  state: () => ({
    approvalStatus: approvalStatus.value,
    checkManage: searchParams.checkManage,
  }),
  onRestore(state) {
    // 恢复 Tab 和 AppSegmented 组件选中状态
    approvalStatus.value = state.approvalStatus || 'pending'
    searchParams.checkManage = !!state.checkManage

    // 根据 approvalStatus 还原 orderState 查询参数
    if (approvalStatus.value === 'pending') {
      searchParams.orderState = [APPROVE_STATUS_ENUM.PENDING]
    } else {
      searchParams.orderState = [APPROVE_STATUS_ENUM.APPROVED, APPROVE_STATUS_ENUM.REJECTED]
    }
  },
})

onMounted(() => {
  const userLevel = getUserAccessLevel(loginUser.value.userInfo.roles)
  const hasCache = filterCache.restore()

  if (userLevel === ACCESS_ENUM.ADMIN) {
    showSegmented.value = true // 管理员显示分段控制器

    // 无缓存时管理员默认"审批"视角
    if (!hasCache) {
      searchParams.checkManage = true
    }
  }

  pageTitle.value = searchParams.checkManage ? '考勤审批' : '申请记录'
})
</script>

<style lang="scss" scoped>
#record-page {
  /* 该页面禁止选中文本 */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

:deep(.record-page-header) {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  z-index: 999;
  border-bottom: 1px solid #e5e8eb;

  .t-navbar__content {
    background: transparent;
  }

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px;

    .t-tabs {
      --td-tab-nav-background: transparent;
      --td-tab-item-height: 36px;

      .t-tabs__nav--split::after {
        height: 0;
      }
    }
  }

  .batch-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;

    .batch-action-left {
      --td-checkbox-bg-color: transparent;
      --td-checkbox-vertical-padding: 0;
      --td-checkbox-icon-size: 18px;

      display: flex;
      align-items: center;
      gap: 8px;

      .t-checkbox__title {
        font-size: 14px;
      }
    }

    .batch-action-right {
      display: flex;
      align-items: center;

      .selected-count {
        font-size: 13px;
        color: #86909c;
        margin-right: 4px;
        white-space: nowrap;
      }
    }
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 96px;
  transition: padding-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 动态 paddingTop 状态控制 */
  &.is-empty,
  &.is-loading {
    padding-top: 128px;
  }

  &.is-has-data {
    padding-top: 108px;
  }

  &.is-batch-mode.is-empty,
  &.is-batch-mode.is-loading {
    padding-top: 178px;
  }

  &.is-batch-mode.is-has-data {
    padding-top: 158px;
  }

  .list-card-wrapper {
    margin-bottom: 10px;
  }

  .batch-card {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1.5px solid transparent;
    background: #fff;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
    }

    .t-checkbox {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    .batch-card-check-icon {
      position: absolute;
      left: 1.5px;
      top: 1.5px;
      z-index: 1;
      pointer-events: none;
    }

    .batch-card-content {
      pointer-events: none; /* 防止点卡片内部文案时触发两次（一次 card、一次 内部按钮） */
    }
  }

  .batch-card--active {
    border-color: #0052d9;

    /* 选中角标（左上角三角形 + 对号） */
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 0;
      border: 14px solid #0052d9;
      border-bottom-color: transparent;
      border-right-color: transparent;
      pointer-events: none;
    }
  }
}
</style>
