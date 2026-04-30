<template>
  <div id="record-detail-page">
    <div class="nav-bar" @click="router.push('/record')">
      <SvgIcon name="chevron-left" size="22px" />
      申请详情
    </div>

    <div class="user-info-bar">
      <!-- 用户头像 -->
      <img src="../../assets/svgs/detail-avatar.svg" class="user-avatar" alt="avatar" />
      <!-- 用户简要信息 -->
      <div class="user-desc">
        <div class="user-status">
          <div class="user-name">{{ recordDetailData?.nickname }}</div>
          <t-tag
            v-if="recordDetailData?.orderState === 0"
            variant="light"
            theme="warning"
            style="font-weight: 500"
          >
            <template #icon>
              <SvgIcon name="clock" size="12px" />
            </template>
            审批中
          </t-tag>
          <t-tag
            v-else-if="recordDetailData?.orderState === 1"
            variant="light"
            theme="success"
            style="font-weight: 500"
          >
            <template #icon>
              <SvgIcon name="check-circle" size="12px" />
            </template>
            已审批
          </t-tag>
          <t-tag
            v-else-if="recordDetailData?.orderState === 2"
            variant="light"
            theme="error"
            style="font-weight: 500"
          >
            <template #icon>
              <SvgIcon name="close-circle" size="12px" />
            </template>
            已驳回
          </t-tag>
        </div>
        <div class="user-role">
          <span>{{ recordDetailData?.deptName }}</span>
        </div>
      </div>
    </div>

    <div class="detail-container">12121</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'
import { fetchApprovalRecordDetailUsingGet } from '@/api/approve-controller'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()

interface Props {
  id: string | number
}

const props = defineProps<Props>()

const recordDetailData = ref<any>()

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
</style>
