<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-05-03 01:08
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-06 09:09
 * @FilePath     : \attendance-frontend-mobile\src\pages\record\components\RecordListCard.vue
 * @Description  : 审批/申请记录单条卡片组件
-->
<template>
  <div class="record-list-card">
    <div class="list-item">
      <IconContainer
        :icon="APPLY_ICON_MAP[record?.orderType]?.icon ?? ''"
        :theme="APPLY_ICON_MAP[record?.orderType]?.theme"
      />
      <div class="list-item-content">
        <div class="list-item-header">
          <div class="list-item-title">{{ record?.orderType }}申请</div>
          <t-tag variant="light" :theme="APPROVE_TAG_MAP[record?.orderState]?.theme">
            <template #icon>
              <SvgIcon :name="APPROVE_TAG_MAP[record?.orderState]?.icon ?? ''" size="12px" />
            </template>
            {{ APPROVE_STATUS_MAP[record?.orderState] }}
          </t-tag>
        </div>

        <div class="list-item-desc">
          <div class="list-item-username">{{ record?.nickname }}</div>
          <div class="list-item-time" v-if="record.orderState !== APPROVE_STATUS_ENUM.PENDING">
            审批时间：{{ formatDate(record?.updateTime) }}
          </div>
        </div>
      </div>
    </div>

    <div class="list-item-extra">
      <div class="list-item-extra-time">申请时间：{{ formatDate(record?.createTime) }}</div>
      <div class="list-item-action">
        <t-button
          v-if="record?.orderState === APPROVE_STATUS_ENUM.PENDING && isApproveView"
          theme="primary"
          size="small"
          @click="router.push(`/record/${record?.id}/approve`)"
        >
          去审批
        </t-button>
        <t-button
          v-if="record?.orderState !== APPROVE_STATUS_ENUM.PENDING || !isApproveView"
          theme="light"
          size="small"
          @click="router.push(`/record/${record?.id}`)"
        >
          详情
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import {
  APPLY_ICON_MAP,
  APPROVE_STATUS_ENUM,
  APPROVE_STATUS_MAP,
  APPROVE_TAG_MAP,
} from '@/constants/record'
import { formatDate } from '@/utils/date'
import IconContainer from '@/components/IconContainer.vue'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()

interface Props {
  record: any
  // 是否为审批视角
  isApproveView?: boolean
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.record-list-card {
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
