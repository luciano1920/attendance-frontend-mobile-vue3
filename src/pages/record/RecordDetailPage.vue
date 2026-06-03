<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/record/RecordDetailPage.vue
 * @Description  : 记录详情页
-->
<template>
  <div id="record-detail-page">
    <div class="nav-bar" @click="router.push('/record')">
      <AppSvgIcon name="chevron-left" size="22px" />
      申请详情
    </div>

    <div class="user-info-bar">
      <!-- 用户头像 -->
      <img src="@/assets/svgs/detail-avatar.svg" class="user-avatar" alt="avatar" />
      <!-- 用户简要信息 -->
      <div class="user-desc">
        <div class="user-status">
          <div class="user-name">{{ recordDetailData?.nickname }}</div>
          <t-tag variant="light" :theme="APPROVE_TAG_MAP[recordDetailData?.orderState]?.theme">
            <template #icon>
              <AppSvgIcon
                :name="APPROVE_TAG_MAP[recordDetailData?.orderState]?.icon ?? ''"
                size="12px"
              />
            </template>
            {{ APPROVE_STATUS_MAP[recordDetailData?.orderState] }}
          </t-tag>
        </div>
        <div class="user-role">
          <span>{{ recordDetailData?.deptName }}</span>
        </div>
      </div>
    </div>

    <div class="description-container">
      <!-- 基础信息-->
      <AppDescriptions title="申请详情" :items="baseItems" :data="recordDetailData">
        <template #item-orderType="{ value }">
          <t-tag variant="light" theme="primary">{{ value }}申请</t-tag>
        </template>
      </AppDescriptions>

      <!-- 请假详情 -->
      <AppDescriptions
        v-if="recordDetailData?.orderType === '请假' && recordDetailData?.leaveOrderFlowDTO"
        title="请假详情"
        :items="leaveItems"
        :data="recordDetailData?.leaveOrderFlowDTO"
      >
        <template #item-leaveTime="{ value }">
          <div v-for="(range, idx) in value" :key="idx">
            {{ formatDateRange(range) }}
          </div>
        </template>
        <template #item-files="{ value }">
          <div class="files-container">
            <t-image
              v-for="(file, idx) in value"
              :key="idx"
              :src="file"
              shape="round"
              fit="cover"
              style="height: 72px"
              @click="handlePreview(value)"
            />
          </div>
        </template>
      </AppDescriptions>

      <!-- 调休详情 -->
      <AppDescriptions
        v-if="recordDetailData?.orderType === '调休' && recordDetailData?.compLeaveOrderFlowDTO"
        title="调休详情"
        :items="restItems"
        :data="recordDetailData?.compLeaveOrderFlowDTO"
      >
        <template #item-restTime="{ value }">
          <div v-for="(range, idx) in value" :key="idx">
            {{ formatDateRange(range) }}
          </div>
        </template>
      </AppDescriptions>

      <!-- 外出详情 -->
      <AppDescriptions
        v-if="recordDetailData?.orderType === '外出' && recordDetailData?.travelOrderFlowDTO"
        title="外出详情"
        :items="outingItems"
        :data="recordDetailData?.travelOrderFlowDTO"
      >
        <template #item-outingTime="{ value }">
          <div v-for="(range, idx) in value" :key="idx">
            {{ formatDateRange(range) }}
          </div>
        </template>
        <template #item-files="{ value }">
          <div class="files-container">
            <t-image
              v-for="(file, idx) in value"
              :key="idx"
              :src="file"
              shape="round"
              fit="cover"
              style="height: 72px"
              @click="handlePreview(value)"
            />
          </div>
        </template>
      </AppDescriptions>

      <!-- 补卡详情 -->
      <AppDescriptions
        v-if="recordDetailData?.orderType === '补卡' && recordDetailData?.attenCorrectionFlowDTO"
        title="补卡详情"
        :items="makeupItems"
        :data="recordDetailData?.attenCorrectionFlowDTO"
      >
        <template #item-makeupTime="{ value }">
          <div v-for="(date, idx) in value" :key="idx">
            {{ formatDateYMD(date) }}
          </div>
        </template>
      </AppDescriptions>

      <!-- 人脸变更详情 -->
      <AppDescriptions
        v-if="recordDetailData?.orderType === '人脸' && recordDetailData?.faceChangeOrderFlowDTO"
        title="人脸变更详情"
        :items="faceUpdateItems"
        :data="recordDetailData?.faceChangeOrderFlowDTO"
      >
        <template #item-faceFile="{ value }">
          <t-image
            :src="value"
            shape="round"
            fit="cover"
            style="height: 72px"
            @click="handlePreview([value])"
          />
        </template>
      </AppDescriptions>

      <!-- 审批详情 -->
      <AppDescriptions title="审批详情" :items="approvalItems" :data="recordDetailData" />

      <!-- 撤销申请 -->
      <t-button
        v-if="recordDetailData?.orderState === APPROVE_STATUS_ENUM.PENDING"
        theme="primary"
        size="large"
        @click="handleRevoke"
      >
        撤销申请
      </t-button>
    </div>

    <!-- 图片预览组件 -->
    <t-image-viewer :images="previewImgs" :visible="imgVisible" @close="imgVisible = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DialogPlugin, Message } from 'tdesign-mobile-vue'

import {
  fetchApprovalRecordDetailUsingGet,
  revokeApplicationUsingGet,
} from '@/api/approve-controller'
import { APPROVE_STATUS_ENUM, APPROVE_STATUS_MAP, APPROVE_TAG_MAP } from '@/constants/record'
import { formatDate, formatDateRange, formatDateYMD } from '@/utils/date'
import AppSvgIcon from '@/components/AppSvgIcon.vue'
import type { DescriptionsItemColumn } from '@/components/AppDescriptions.vue'
import AppDescriptions from '@/components/AppDescriptions.vue'

const router = useRouter()

interface Props {
  id: string | number
}

const props = defineProps<Props>()

// 详情数据
const recordDetailData = ref<any>()

// 控制图片预览组件
const imgVisible = ref<boolean>(false)
// 预览图片列表
const previewImgs = ref<string[]>([])

/**
 * 处理预览
 * @param fileIds 预览文件的 Url 列表
 */
const handlePreview = (fileIds: string[]) => {
  previewImgs.value = fileIds
  imgVisible.value = true
}

// ==================== 配置式 items 定义 ====================

const baseItems: DescriptionsItemColumn[] = [
  { field: 'orderType', label: '申请类型' },
  { field: 'partyAccount', label: '申请人工号' },
  { field: 'mobile', label: '申请人联系方式' },
  { field: 'createTime', label: '申请时间', formatter: (val) => formatDate(val) },
]

const leaveItems: DescriptionsItemColumn[] = [
  { field: 'leaveType', label: '请假类型' },
  { field: 'leaveDaySum', label: '请假天数', formatter: (val) => `${val ?? 0} 天` },
  { field: 'appLeaveTimeVOS', label: '请假时段', slotName: 'leaveTime' },
  { field: 'leaveReason', label: '请假原因' },
  { field: 'fileIds', label: '附件', slotName: 'files' },
]

const restItems: DescriptionsItemColumn[] = [
  { field: 'leaveDaySum', label: '调休天数', formatter: (val) => `${val ?? 0} 天` },
  { field: 'appLeaveTimeVOS', label: '调休时间', slotName: 'restTime' },
  { field: 'compLeaveReason', label: '调休原因' },
]

const outingItems: DescriptionsItemColumn[] = [
  { field: 'travelType', label: '外出类型' },
  { field: 'leaveDaySum', label: '外出天数', formatter: (val) => `${val ?? 0} 天` },
  { field: 'appLeaveTimeVOS', label: '外出时间', slotName: 'outingTime' },
  { field: 'travelReason', label: '外出原因' },
  { field: 'fileIds', label: '附件', slotName: 'files' },
]

const makeupItems: DescriptionsItemColumn[] = [
  { field: 'attenCorrectionType', label: '补卡类型' },
  { field: 'attenCorrectionDaySum', label: '补卡天数', formatter: (val) => `${val ?? 0} 天` },
  { field: 'attenCorrection', label: '补卡日期', slotName: 'makeupTime' },
  { field: 'attenCorrectionReason', label: '补卡原因' },
]

const faceUpdateItems: DescriptionsItemColumn[] = [{ field: 'faceFile', label: '人脸照片' }]

const approvalItems: DescriptionsItemColumn[] = [
  { field: 'deptCheckerNickname', label: '审批人' },
  { field: 'updateTime', label: '审批时间', formatter: (val) => formatDate(val) },
  { field: 'checkMessage', label: '审批意见' },
]

/** 获取详情数据 */
const getRecordDetail = async () => {
  if (!props.id) return

  const res = await fetchApprovalRecordDetailUsingGet({ id: props.id })
  if (res.data.code === 0 && res.data.data) {
    recordDetailData.value = res.data.data
  } else {
    Message.error({
      content: '获取详情失败，' + res.data.msg,
      offset: [10, 16],
    })
  }
}

/** 处理撤销申请 */
const handleRevoke = () => {
  DialogPlugin.confirm({
    title: '撤销申请',
    content: '该操作将撤销该条申请记录，此操作不可逆，是否继续？',
    confirmBtn: '撤销',
    cancelBtn: '取消',
    onConfirm: async () => {
      const res = await revokeApplicationUsingGet({ orderId: props.id })
      if (res.data.code === 0) {
        Message.success({
          content: '撤销申请成功',
          offset: [10, 16],
        })
        router.push({
          path: '/record',
          replace: true,
        })
      } else {
        Message.error({
          content: '撤销申请失败，' + res.data.msg,
          offset: [10, 16],
        })
      }
    },
  })
}

onMounted(() => {
  getRecordDetail()
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

.user-info-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 24px;
  background-color: #fff;

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #ffe8e0;
    padding: 1px;
  }

  .user-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .user-status {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-name {
        font-size: 17px;
        font-weight: 600;
        color: #171a1d;
      }
    }

    .user-role {
      font-size: 13px;
      color: #86909c;
    }
  }
}

.description-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 48px;
}

.files-container {
  display: flex;
  gap: 8px;
}
</style>
