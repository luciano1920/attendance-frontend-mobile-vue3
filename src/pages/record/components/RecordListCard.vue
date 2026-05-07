<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-05-03 01:08
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-07 08:45
 * @FilePath     : \attendance-frontend-mobile\src\pages\record\components\RecordListCard.vue
 * @Description  : 审批/申请记录单条卡片组件
-->
<template>
  <div
    class="record-list-card"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
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
import { onUnmounted } from 'vue'
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

const emit = defineEmits(['long-press'])

// 设置定时器，记录触摸开始时间
let timer: ReturnType<typeof setTimeout> | null = null
let isMoved = false

/** 手指按下时触发 */
const handleTouchStart = () => {
  // 重置移动状态，表示刚开始按下，尚未移动
  isMoved = false

  if (timer) {
    clearTimeout(timer) // 防抖处理：如果上次长按还没结束又按下了，清除上次的计时器
  }

  timer = setTimeout(() => {
    if (!isMoved) {
      // 如果时间到了且手指没动，触发长按事件
      emit('long-press')
    }
  }, 500) // 500ms 长按阈值
}

/** 手指在屏幕上滑动时触发 */
const handleTouchMove = () => {
  // 标记为已移动
  isMoved = true

  if (timer) {
    clearTimeout(timer) // 既然移动了，就不可能是长按了，立即取消计时
    timer = null
  }
}

/** 手指离开屏幕时触发 */
const handleTouchEnd = () => {
  if (timer) {
    clearTimeout(timer) // 手指提前离开了，时间未到，取消计时
    timer = null
  }
}

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style lang="scss" scoped>
.record-list-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 14px;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

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
