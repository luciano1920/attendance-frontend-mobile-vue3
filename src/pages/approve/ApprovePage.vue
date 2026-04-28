<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-30 11:37
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-26 20:31
 * @FilePath     : \attendance-frontend-mobile\src\pages\approve\ApprovePage.vue
 * @Description  : 审批/申请记录列表页
-->
<template>
  <div id="approve-page">
    <t-navbar :fixed="false" title="考勤审核" />
    <t-tabs default-value="first">
      <t-tab-panel value="first" :badge-props="{ dot: true, offset: [0, 1] }" label="待审批">
        <div style="padding: 16px; background-color: #fff">
          <Segmented v-model:value="value" :options="options" shape="round">
            <template #label="{ label, payload }">
              <SvgIcon :name="payload.icon" />
              <span style="margin-left: 4px">{{ label }}</span>
            </template>
          </Segmented>
        </div>
        <div class="pending-list">
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
        </div>
      </t-tab-panel>

      <t-tab-panel value="second" label="已审批">
        <t-empty
          v-if="approveDataList.length === 0"
          description="暂无数据"
          style="margin-top: 48px"
        >
          <template #icon>
            <SvgIcon name="funnel" size="48px" />
          </template>
        </t-empty>

        <div v-else class="completed-list">
          已审批
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
          <ApproveInfoCard />
        </div>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApproveInfoCard from './components/ApproveInfoCard.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import Segmented from '@/components/Segmented.vue'

const approveDataList = ref([])

const value = ref<string | number>('approve')
const options = [
  { label: '审批', value: 'approve', payload: { icon: 'check-check' } },
  { label: '我的申请', value: 'apply', payload: { icon: 'list' } },
]
</script>

<style lang="scss" scoped>
.t-tabs {
  background: transparent;
}

.pending-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 16px 16px 96px;
}

.completed-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 16px 16px 96px;
}
</style>
