<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-30 14:35
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-30 15:17
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
    </div>

    <div v-if="applyRecordDataList.length === 0" style="padding-top: 128px">
      <t-loading
        text="数据加载中"
        layout="vertical"
        theme="dots"
        size="32px"
        :loading="recordLoading"
      />

      <t-empty v-if="!recordLoading" description="暂无数据">
        <template #icon>
          <SvgIcon name="funnel" size="48px" />
        </template>
      </t-empty>
    </div>

    <div v-else class="record-list">
      <t-list :async-loading="listLoading" :on-scroll="handleScroll">
        <div class="list-item-card" v-for="recordItem in applyRecordDataList" :key="recordItem.id">
          <div class="list-item">
            <IconContainer
              :icon="APPLY_ICON_MAP[recordItem?.orderType]?.icon ?? ''"
              :theme="APPLY_ICON_MAP[recordItem?.orderType]?.theme"
            />
            <div class="list-item-content">
              <div class="list-item-header">
                <div class="list-item-title">{{ recordItem?.orderType }}申请</div>
                <t-tag
                  v-if="recordItem.orderState === 0"
                  variant="light"
                  theme="warning"
                  class="list-item-status"
                >
                  <template #icon>
                    <SvgIcon name="clock" size="12px" />
                  </template>
                  审批中
                </t-tag>
                <t-tag
                  v-else-if="recordItem.orderState === 1"
                  variant="light"
                  theme="success"
                  class="list-item-status"
                >
                  <template #icon>
                    <SvgIcon name="check-circle" size="12px" />
                  </template>
                  已审批
                </t-tag>
                <t-tag
                  v-else-if="recordItem.orderState === 2"
                  variant="light"
                  theme="error"
                  class="list-item-status"
                >
                  <template #icon>
                    <SvgIcon name="close-circle" size="12px" />
                  </template>
                  已驳回
                </t-tag>
              </div>
              <div class="list-item-desc">
                <div class="list-item-username">{{ recordItem?.nickname }}</div>
                <div class="list-item-time" v-if="recordItem.orderState !== 0">
                  审批时间： {{ formatDate(recordItem?.updateTime) }}
                </div>
              </div>
            </div>
          </div>
          <div class="list-item-extra">
            <div class="list-item-extra-time">
              申请时间：{{ formatDate(recordItem?.createTime) }}
            </div>
            <div class="list-item-action">
              <t-button
                v-if="recordItem.orderState === 0"
                theme="primary"
                size="small"
                @click="router.push(`/record/${recordItem.id}/approve`)"
              >
                去审批
              </t-button>
              <t-button
                v-if="recordItem.orderState !== 0"
                theme="light"
                size="small"
                @click="router.push(`/record/${recordItem.id}`)"
              >
                详情
              </t-button>
            </div>
          </div>
        </div>
      </t-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Message, type ListProps, type TabValue } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { fetchApprovalRecordByPageUsingPost } from '@/api/approve-controller'
import { ACCESS_ENUM, getUserAccessLevel } from '@/constants/access'
import { APPLY_ICON_MAP } from '@/constants/record'
import { formatDate } from '@/utils/date'
import IconContainer from '@/components/IconContainer.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import Segmented from '@/components/Segmented.vue'

const router = useRouter()

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)

const pageTitle = ref<string>('申请记录')

// 审批状态，绑定 TabValue
const approvalStatus = ref<string>('pending')

// 分段控制选项，用于区分个人申请清单还是管理员审批清单
const showSegmented = ref<boolean>(false) // 管理员角色才能看到分段控制器
const segmentOptions = [
  { label: '审批', value: true, payload: { icon: 'check-check' } },
  { label: '我的申请', value: false, payload: { icon: 'list' } },
]

const listLoading = ref<ListProps['asyncLoading']>('') // 列表组件加载状态，用于控制 List 组件
const recordLoading = ref<boolean>(true) // 记录加载状态，用于控制 Loading 组件

// 查询参数
const searchParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderState: [0],
  checkManage: false,
})
const recordTotal = ref<number>(0)

// 申请记录数据列表
const applyRecordDataList = ref<any[]>([])

/**
 * Tab 切换事件处理函数
 * @param value 选中的 Tab
 */
const handleTabChange = (value: TabValue) => {
  if (value === 'pending') {
    searchParams.orderState = [0]
  } else {
    searchParams.orderState = [1, 2]
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
  // 如果已经在加载中，则不再加载
  if (listLoading.value === 'loading') {
    return
  }

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
  if (scrollBottom < 20 && applyRecordDataList.value.length < recordTotal.value) {
    searchParams.pageNo += 1
    getApplyRecordDataList()
  }
}

onMounted(() => {
  const userLevel = getUserAccessLevel(loginUser.value.userInfo.roles)
  if (userLevel === ACCESS_ENUM.ADMIN) {
    showSegmented.value = true
    searchParams.checkManage = true
    pageTitle.value = '考勤审批'
  }

  getApplyRecordDataList()
})
</script>

<style lang="scss" scoped>
:deep(.record-page-header) {
  box-sizing: border-box;
  position: fixed;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  z-index: 9999;

  .t-navbar__content {
    background: transparent;
  }

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 8px;
    border-bottom: 1px solid #e5e8eb;

    .t-tabs {
      --td-tab-nav-background: transparent;
      --td-tab-item-height: 36px;

      .t-tabs__scroll--split::after {
        height: 0;
      }
    }
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 108px 16px 96px;
}

.list-item-card {
  background-color: #fff;
  border-radius: 14px;
  margin-bottom: 8px;

  .list-item {
    padding: 14px 16px;
    border-bottom: 1px solid #f5f6f7;
    display: flex;
    gap: 12px;

    .list-item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;

      .list-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .list-item-title {
          color: #171a1d;
          font-size: 15px;
          font-weight: 600;
        }

        .list-item-status {
          font-weight: 500;
        }
      }

      .list-item-desc {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .list-item-username {
          color: #86909c;
          font-size: 13px;
          font-weight: 500;
        }

        .list-item-time {
          color: #86909c;
          font-size: 12px;
        }
      }
    }
  }

  .list-item-extra {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .list-item-extra-time {
      font-size: 12px;
      color: #4e5969;
    }

    .list-item-action {
      display: flex;
      align-items: center;
      gap: 8px;
      --td-button-border-radius: 8px;
      --td-button-font-weight: 500;
      --td-button-small-font-size: 12px;
      --td-button-small-height: 30px;
    }
  }
}
</style>
