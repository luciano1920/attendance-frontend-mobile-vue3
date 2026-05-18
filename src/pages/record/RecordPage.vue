<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-30 14:35
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-18 16:00
 * @FilePath     : \attendance-frontend-mobile\src\pages\record\RecordPage.vue
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

        <Segmented
          v-if="showSegmented"
          v-model:value="searchParams.checkManage"
          :options="segmentOptions"
          shape="round"
          @change="handleSegmentChange"
        >
          <template #label="{ label, payload }">
            <SvgIcon :name="payload.icon" />
            <span style="margin-left: 4px">{{ label }}</span>
          </template>
        </Segmented>
      </div>

      <div v-if="isBatchMode" class="batch-action-bar">
        <div class="batch-action-left">
          <t-button variant="text" theme="default" size="extra-small" @click="exitBatchMode">
            取消
          </t-button>

          <!-- 全选 -->
          <t-checkbox
            v-if="canBatchMode"
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

    <div
      v-if="applyRecordDataList.length === 0"
      :style="{ paddingTop: isBatchMode ? '178px' : '128px' }"
    >
      <t-loading
        text="数据加载中"
        layout="vertical"
        theme="dots"
        size="32px"
        :loading="recordLoading"
      />

      <t-pull-down-refresh v-if="!recordLoading" @refresh="handleRefresh">
        <t-empty description="暂无数据">
          <template #icon>
            <SvgIcon name="funnel" size="48px" />
          </template>
        </t-empty>
      </t-pull-down-refresh>
    </div>

    <div v-else class="record-list" :style="{ paddingTop: isBatchMode ? '158px' : '108px' }">
      <t-pull-down-refresh @refresh="handleRefresh">
        <t-list :async-loading="listLoading" :on-scroll="handleScroll">
          <!-- 批量模式 -->
          <t-checkbox-group
            v-if="isBatchMode && canBatchMode"
            v-model:value="batchRecordIds"
            borderless
          >
            <div
              v-for="recordItem in applyRecordDataList"
              :key="recordItem.id"
              class="batch-card"
              :class="{ 'batch-card--active': batchRecordIds.includes(recordItem.id) }"
            >
              <!-- 选中角标 -->
              <SvgIcon
                v-if="batchRecordIds.includes(recordItem.id)"
                class="batch-card-check-icon"
                name="check"
                color="#ffffff"
              />

              <!-- 隐藏的 checkbox ，宽高设为父容器的 100% ，label 和 content 都默认为空-->
              <t-checkbox
                :value="recordItem.id"
                icon="none"
                style="position: absolute; opacity: 0"
              />

              <!-- 卡片内容 -->
              <div class="batch-card-content">
                <RecordListCard :record="recordItem" :is-approve-view="searchParams.checkManage" />
              </div>
            </div>
          </t-checkbox-group>

          <!-- 非批量模式：普通卡片列表 -->
          <template v-else>
            <RecordListCard
              v-for="recordItem in applyRecordDataList"
              :key="recordItem.id"
              :record="recordItem"
              :is-approve-view="searchParams.checkManage"
              @long-press="enterBatchMode(recordItem.id)"
            />
          </template>
        </t-list>
      </t-pull-down-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Message, type ListProps, type TabValue } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { useFilterCache } from '@/composables/useFilterCache'
import {
  approveApplicationUsingPost,
  fetchApprovalRecordByPageUsingPost,
} from '@/api/approve-controller'
import { ACCESS_ENUM, getUserAccessLevel } from '@/constants/access'
import { APPROVE_STATUS_ENUM } from '@/constants/record'
import SvgIcon from '@/components/SvgIcon.vue'
import Segmented from '@/components/Segmented.vue'
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

// ==================== 列表数据 ====================
const listLoading = ref<ListProps['asyncLoading']>('') // 列表组件加载状态，用于控制 List 组件
const recordLoading = ref<boolean>(true) // 记录加载状态，用于控制 Loading 组件

// 查询参数
const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderState: [APPROVE_STATUS_ENUM.PENDING],
  checkManage: false,
})

const recordTotal = ref<number>(0)
// 申请记录数据列表
const applyRecordDataList = ref<any[]>([])

// ========== 批量操作 ==========
const isBatchMode = ref<boolean>(false) // 是否处于批量操作模式
const batchRecordIds = ref<Array<number>>([]) // 批量操作的记录 id 列表

// 计算属性：判断当前是否可以批量操作
const canBatchMode = computed(() => {
  return approvalStatus.value === 'pending' && searchParams.checkManage === true
})

// 是否全选
const isAllSelected = computed(() => {
  if (applyRecordDataList.value.length === 0) {
    return false
  }
  return applyRecordDataList.value.every((item) => batchRecordIds.value.includes(item.id))
})

/**
 * 进入批量模式（默认选中触发项）
 * @param id 当前记录 id
 */
const enterBatchMode = (id: number) => {
  if (!canBatchMode.value) {
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
  if (checked) {
    batchRecordIds.value = applyRecordDataList.value.map((item: any) => Number(item.id))
  } else {
    batchRecordIds.value = []
  }
}

// 监听 Tab 和 Segmented 切换，自动退出批量模式
watch(approvalStatus, () => isBatchMode.value && exitBatchMode())
watch(
  () => searchParams.checkManage,
  () => isBatchMode.value && exitBatchMode(),
)

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
    Message.success({
      content: '批量处理成功',
      offset: [10, 16],
    })
    exitBatchMode()
    // 刷新列表
    searchParams.pageNo = 1
    applyRecordDataList.value = []
    recordTotal.value = 0
    getApplyRecordDataList()
  } else {
    Message.error({
      content: '批量处理失败，' + res.data.msg,
      offset: [10, 16],
    })
  }
}

// ==================== 列表数据获取 ====================

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
  searchParams.pageNo = 1
  applyRecordDataList.value = []
  recordTotal.value = 0
  getApplyRecordDataList()
}

/** Segmented 切换事件处理函数 */
const handleSegmentChange = () => {
  searchParams.pageNo = 1
  applyRecordDataList.value = []
  recordTotal.value = 0
  getApplyRecordDataList()
}

/** 获取申请记录数据列表 */
const getApplyRecordDataList = async () => {
  // 如果不是第一页，且当前已加载的数据量已经达到或超过总量，则不再加载
  if (searchParams.pageNo > 1 && applyRecordDataList.value.length >= recordTotal.value) {
    return
  }

  listLoading.value = 'loading'
  recordLoading.value = true

  try {
    const res = await fetchApprovalRecordByPageUsingPost(searchParams)
    if (res.data.code === 0 && res.data.data) {
      const newList = res.data.data.list ?? []
      // 如果是第一页，直接替换；否则追加数据
      if (searchParams.pageNo === 1) {
        applyRecordDataList.value = newList
      } else {
        applyRecordDataList.value = [...applyRecordDataList.value, ...newList]
      }
      recordTotal.value = res.data.data.total ?? 0
    } else {
      Message.error({
        content: '获取记录失败，' + res.data.msg,
        offset: [10, 16],
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    recordLoading.value = false
    listLoading.value = ''
  }
}

/**
 * 处理列表滑动事件
 * @param scrollBottom 滚动条距离底部的距离
 */
const handleScroll = (scrollBottom: number) => {
  if (scrollBottom < 1 && applyRecordDataList.value.length < recordTotal.value) {
    searchParams.pageNo += 1
    getApplyRecordDataList()
  }
}

/** 处理列表下拉刷新 */
const handleRefresh = () => {
  searchParams.pageNo = 1
  applyRecordDataList.value = []
  recordTotal.value = 0
  getApplyRecordDataList()
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
    // 恢复 Tab 和 Segmented 组件选中状态
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

  if (userLevel === ACCESS_ENUM.ADMIN) {
    showSegmented.value = true // 管理员显示分段控制器

    // 无缓存时管理员默认"审批"视角
    if (!filterCache.restore()) {
      searchParams.checkManage = true
    }
  }

  pageTitle.value = searchParams.checkManage ? '考勤审批' : '申请记录'
  getApplyRecordDataList()
})
</script>

<style lang="scss" scoped>
#record-page {
  // 该页面禁止选中文本
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

      .t-tabs__scroll--split::after {
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
  transition: padding-top 0.3s ease;

  .t-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.batch-card {
  position: relative;
  margin-bottom: 10px;
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
    pointer-events: none; // 防止点卡片内部文案时触发两次（一次 card、一次 内部按钮）
  }
}

.batch-card--active {
  border-color: #0052d9;

  // 选中角标（左上角三角形 + 对号）
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
</style>
