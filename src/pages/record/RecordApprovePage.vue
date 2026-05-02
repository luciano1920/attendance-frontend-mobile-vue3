<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-30 15:10
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-03 00:56
 * @FilePath     : \attendance-frontend-mobile\src\pages\record\RecordApprovePage.vue
 * @Description  :
-->
<template>
  <div id="record-approve-page">
    <div class="nav-bar" @click="router.push('/record')">
      <SvgIcon name="chevron-left" size="22px" />
      审批详情
    </div>

    <div class="user-info-bar">
      <!-- 用户头像 -->
      <img src="../../assets/svgs/detail-avatar.svg" class="user-avatar" alt="avatar" />
      <!-- 用户简要信息 -->
      <div class="user-desc">
        <div class="user-status">
          <div class="user-name">{{ recordApproveData?.nickname }}</div>
          <t-tag variant="light" :theme="APPROVE_TAG_MAP[recordApproveData?.orderState]?.theme">
            <template #icon>
              <SvgIcon :name="APPROVE_TAG_MAP[recordApproveData?.orderState]?.icon" size="12px" />
            </template>
            {{ APPROVE_STATUS_MAP[recordApproveData?.orderState] }}
          </t-tag>
        </div>
        <div class="user-role">
          <span>{{ recordApproveData?.deptName }}</span>
        </div>
      </div>
    </div>

    <div class="detail-container">
      <!-- 基础信息-->
      <Descriptions title="申请详情" :items="baseItems" :data="recordApproveData">
        <template #item-orderType="{ value }">
          <t-tag variant="light" theme="primary">{{ value }}申请</t-tag>
        </template>
      </Descriptions>

      <!-- 请假详情 -->
      <Descriptions
        v-if="recordApproveData?.orderType === '请假' && recordApproveData?.leaveOrderFlowDTO"
        title="请假详情"
        :items="leaveItems"
        :data="recordApproveData?.leaveOrderFlowDTO"
      >
        <template #item-leaveTime="{ value }">
          <div v-for="(range, idx) in value" :key="idx">
            {{ formatDateRange(range) }}
          </div>
        </template>
        <template #item-proxy="{ value, row }">
          {{ value }}
          <span class="proxy-sub">({{ row?.leaveProxyPartyAccount }})</span>
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
      </Descriptions>

      <!-- 调休详情 -->
      <Descriptions
        v-if="recordApproveData?.orderType === '调休' && recordApproveData?.compLeaveOrderFlowDTO"
        title="调休详情"
        :items="restItems"
        :data="recordApproveData?.compLeaveOrderFlowDTO"
      >
        <template #item-restTime="{ value }">
          <div v-for="(range, idx) in value" :key="idx">
            {{ formatDateRange(range) }}
          </div>
        </template>
      </Descriptions>

      <!-- 外出详情 -->
      <Descriptions
        v-if="recordApproveData?.orderType === '外出' && recordApproveData?.travelOrderFlowDTO"
        title="外出详情"
        :items="outingItems"
        :data="recordApproveData?.travelOrderFlowDTO"
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
      </Descriptions>

      <!-- 补卡详情 -->
      <Descriptions
        v-if="recordApproveData?.orderType === '补卡' && recordApproveData?.attenCorrectionFlowDTO"
        title="补卡详情"
        :items="makeupItems"
        :data="recordApproveData?.attenCorrectionFlowDTO"
      >
        <template #item-makeupTime="{ value }">
          <div v-for="(date, idx) in value" :key="idx">
            {{ formatDateYMD(date) }}
          </div>
        </template>
      </Descriptions>

      <!-- 人脸变更详情 -->
      <Descriptions
        v-if="recordApproveData?.orderType === '人脸' && recordApproveData?.faceChangeOrderFlowDTO"
        title="人脸变更详情"
        :items="faceUpdateItems"
        :data="recordApproveData?.faceChangeOrderFlowDTO"
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
      </Descriptions>

      <!-- 审批详情 -->
      <Descriptions title="审批意见">
        <t-textarea
          v-model="formData.checkMessage"
          placeholder="请输入审批意见"
          :autosize="{ minRows: 2, maxRows: 5 }"
        />
      </Descriptions>

      <div class="approve-action">
        <t-button
          size="large"
          theme="danger"
          variant="outline"
          class="action-btn"
          @click="handleApprove(APPROVE_STATUS_ENUM.REJECTED)"
        >
          <template #icon>
            <SvgIcon name="close-circle" />
          </template>
          驳回
        </t-button>
        <t-button
          theme="primary"
          size="large"
          class="action-btn"
          @click="handleApprove(APPROVE_STATUS_ENUM.APPROVED)"
        >
          <template #icon>
            <SvgIcon name="check-circle" />
          </template>
          通过
        </t-button>
      </div>
    </div>

    <!-- 图片预览组件 -->
    <t-image-viewer :images="previewImgs" :visible="imgVisible" @close="imgVisible = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import {
  approveApplicationUsingPost,
  fetchApprovalRecordDetailUsingGet,
} from '@/api/approve-controller'
import { APPROVE_STATUS_ENUM, APPROVE_STATUS_MAP, APPROVE_TAG_MAP } from '@/constants/record'
import { formatDate, formatDateRange, formatDateYMD } from '@/utils/date'
import SvgIcon from '@/components/SvgIcon.vue'
import Descriptions from '@/components/Descriptions.vue'
import type { DescriptionsItemColumn } from '@/components/Descriptions.vue'

const router = useRouter()

interface Props {
  id: string | number
}

const props = defineProps<Props>()

// 审批详情数据
const recordApproveData = ref<any>()

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
  { field: 'personType', label: '申请人员类型' },
  { field: 'mobile', label: '申请人联系方式' },
  { field: 'createTime', label: '申请时间', formatter: (val) => formatDate(val) },
]

const leaveItems: DescriptionsItemColumn[] = [
  { field: 'leaveType', label: '请假类型' },
  { field: 'leaveDaySum', label: '请假天数', formatter: (val) => `${val ?? 0} 天` },
  { field: 'appLeaveTimeVOS', label: '请假时段', slotName: 'leaveTime' },
  { field: 'leaveReason', label: '请假原因' },
  { field: 'specificJob', label: '现任具体工作' },
  { field: 'leaveAddress', label: '请假地点' },
  { field: 'leaveProxyNickname', label: '工作代理人', slotName: 'proxy' },
  { field: 'leaveProxyMobile', label: '代理人联系方式' },
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

/** 获取详情数据 */
const getRecordDetail = async () => {
  if (!props.id) return

  const res = await fetchApprovalRecordDetailUsingGet({ id: props.id })
  if (res.data.code === 0 && res.data.data) {
    recordApproveData.value = res.data.data
    formData.id = res.data.data.id
  } else {
    Message.error({
      content: '获取详情失败，' + res.data.msg,
      offset: [10, 16],
    })
  }
}

// 审批状态数据
const formData = reactive({
  id: [],
  orderState: undefined as number | undefined,
  checkMessage: '',
})

/**
 * 处理审批
 * @param state 审批状态
 */
const handleApprove = async (state: number) => {
  if (!formData.id || formData.id.length === 0) return

  formData.orderState = state
  const res = await approveApplicationUsingPost(formData)
  if (res.data.code === 0) {
    Message.success({
      content: '处理成功',
      offset: [10, 16],
    })
    router.push('/record')
  } else {
    Message.error({
      content: '处理失败，' + res.data.msg,
      offset: [10, 16],
    })
  }
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
  padding: 16px 20px;
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

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
}

.proxy-sub {
  font-size: 13px;
  color: #86909c;
}

.files-container {
  display: flex;
  gap: 8px;
}

.approve-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  .action-btn {
    width: 50%;
    gap: 8px;
  }
}
</style>
