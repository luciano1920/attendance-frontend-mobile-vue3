<!--
 * @Author : luciano1920 1290582790@qq.com
 * @Date : 2026-04-21 23:49
 * @LastEditors : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-26 13:27
 * @FilePath : \attendance-frontend-mobile\src\pages\apply\LeaveFormPage.vue
 * @Description : 请假申请表单页面
-->
<template>
  <div id="leave-form-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <SvgIcon name="chevron-left" size="22px" @click="$router.push('/apply')" />
      <div class="form-title">
        <div class="form-name">请假申请</div>
        <div class="form-desc">填写请假信息，等待审批</div>
      </div>
    </div>

    <!-- 表单须知 -->
    <div class="notice-bar">
      <SvgIcon name="triangle-alert" size="15px" color="#E37318" style="margin-top: 2px" />
      <div class="notice-content">
        <div class="notice-title">请假须知</div>
        <div class="notice-desc">ABC类员工仅能在当前系统申请1天以内的请假</div>
      </div>
    </div>

    <!-- 表单主体 -->
    <div class="form-container">
      <!-- 通用 Picker 弹出层 -->
      <t-popup v-model="picker.state.visible" placement="bottom">
        <t-picker
          v-model="picker.state.value"
          :columns="picker.state.options"
          :title="picker.state.title"
          @confirm="picker.handleConfirm"
          @cancel="picker.state.visible = false"
        />
      </t-popup>

      <!-- 时间范围选择器弹出层 -->
      <TimeRangePickerPopup ref="timeRangePickerRef" v-model="formData.appLeaveTimeVOS" />

      <t-form
        ref="formRef"
        :data="formData"
        show-error-message
        label-align="left"
        label-width="auto"
        scroll-to-first-error="smooth"
      >
        <t-form-item label="申请人" content-align="right">
          <t-input v-model="loginUserInfo.username" align="right" borderless disabled />
        </t-form-item>

        <t-form-item
          arrow
          label="审批人"
          name="checkPartyAccount"
          content-align="right"
          @click="picker.open('checkPartyAccount', '选择审批人')"
        >
          <t-input
            :value="picker.getLabel('checkPartyAccount')"
            borderless
            align="right"
            disabled
            placeholder="点击选择审批人"
          />
        </t-form-item>

        <!-- <t-form-item
          arrow
          label="请假类型"
          name="leaveType"
          content-align="right"
          @click="picker.open('leaveType', '选择请假类型')"
        >
          <t-input
            :value="picker.getLabel('leaveType')"
            borderless
            align="right"
            disabled
            placeholder="点击选择请假类型"
          />
        </t-form-item> -->

        <t-form-item label="请假类型" name="leaveType" content-align="right">
          <RadioButtonGroup v-model="formData.leaveType" :options="leaveTypeOptions" />
        </t-form-item>

        <t-form-item
          arrow
          label="假期代理人"
          name="leaveProxyPartyAccount"
          content-align="right"
          @click="picker.open('leaveProxyPartyAccount', '选择假期代理人')"
        >
          <t-input
            :value="picker.getLabel('leaveProxyPartyAccount')"
            borderless
            align="right"
            disabled
            placeholder="点击选择假期代理人"
          />
        </t-form-item>

        <t-form-item
          arrow
          label="请假开始时间"
          name="appLeaveTimeVOS.startTime"
          content-align="right"
          @click="timeRangePickerRef?.openStart()"
        >
          <t-input
            :value="timeRangePickerRef?.startText"
            borderless
            align="right"
            disabled
            placeholder="请选择开始时间"
          />
        </t-form-item>

        <t-form-item
          arrow
          label="请假结束时间"
          name="appLeaveTimeVOS.startTime"
          content-align="right"
          @click="timeRangePickerRef?.openEnd()"
        >
          <t-input
            :value="timeRangePickerRef?.endText"
            borderless
            align="right"
            disabled
            placeholder="请选择结束时间"
          />
        </t-form-item>

        <t-form-item label="现任具体工作" name="specificJob" content-align="right">
          <t-textarea
            v-model="formData.specificJob"
            placeholder="请输入现任具体工作"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>

        <t-form-item label="请假原因" name="leaveReason" content-align="right">
          <t-textarea
            v-model="formData.leaveReason"
            placeholder="请输入请假原因"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>
      </t-form>

      <t-button theme="primary" size="large" @click="handleSubmit" class="form-submit-action">
        提交申请
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Form, RadioOptionObj } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { fetchApproversUsingGet } from '@/api/approve-controller'
import { fetchDictOptionsListUsingGet } from '@/api/dict-controller'
import { fetchAgentUserUsingPost } from '@/api/user-controller'
import { usePicker, type PickerOptionsMap } from '@/composables/usePicker'
import SvgIcon from '@/components/SvgIcon.vue'
import TimeRangePickerPopup from '@/components/TimeRangePickerPopup.vue'
import RadioButtonGroup from '@/components/RadioButtonGroup.vue'

const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

const formData = reactive({
  checkPartyAccount: '',
  leaveType: '',
  leaveProxyPartyAccount: '',
  specificJob: '',
  leaveReason: '',
  fileIds: [],
  appLeaveTimeVOS: {
    startTime: '',
    endTime: '',
  },
})

const leaveTypeOptions = ref<RadioOptionObj[]>([])

const pickerOptions = ref<PickerOptionsMap>({
  checkPartyAccount: [],
  leaveProxyPartyAccount: [],
})

// 采用封装好的 Picker 组合式钩子函数
const picker = usePicker(formData, pickerOptions.value)

const timeRangePickerRef = ref<InstanceType<typeof TimeRangePickerPopup>>()
const formRef = ref<InstanceType<typeof Form>>()

/** 获取审批人选项列表 */
const getApproverList = async () => {
  const res = await fetchApproversUsingGet()
  if (res.data.data && res.data.code === 0) {
    pickerOptions.value.checkPartyAccount = res.data.data.map((item: any) => {
      return { label: item.nickname, value: item.partyAccount }
    })
  }
}

/** 获取请假类型选项列表 */
const getLeaveTypeList = async () => {
  let leaveDictKey = ''
  if (
    loginUserInfo.userType === 1 ||
    loginUserInfo.userType === 2 ||
    loginUserInfo.userType === 10
  ) {
    leaveDictKey = 'leave_order_type_abc'
  } else {
    leaveDictKey = 'leave_order_type'
  }
  const res = await fetchDictOptionsListUsingGet({ type: leaveDictKey })
  if (res.data.code === 0 && res.data.data) {
    leaveTypeOptions.value = res.data.data.map((item: any) => {
      return { label: item.label, value: item.value }
    })
  }
}

/** 获取代理人选项列表 */
const getAgentUserList = async () => {
  const res = await fetchAgentUserUsingPost({ keyword: '' })
  if (res.data.data && res.data.code === 0) {
    pickerOptions.value.leaveProxyPartyAccount = res.data.data.map((item: any) => {
      return { label: item.nickname, value: item.partyAccount }
    })
  }
}

/** 提交表单 */
const handleSubmit = () => {
  console.log('提交给后端的完整 formData:', formData)
}

onMounted(() => {
  getApproverList()
  getLeaveTypeList()
  getAgentUserList()
})
</script>

<style scoped lang="scss">
.form-header {
  background: url('@/assets/svgs/bg/leave.svg');
  background-repeat: no-repeat;
  background-size: 100%;
  box-sizing: border-box;
  padding: 34px 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;

  .form-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .form-name {
      font-size: 20px;
      font-weight: 600;
    }

    .form-desc {
      font-size: 13px;
      font-weight: 300;
    }
  }
}

.notice-bar {
  display: flex;
  padding: 16px 24px;
  align-items: flex-start;
  gap: 10px;
  background-color: #fff7ed;

  .notice-content {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .notice-title {
    color: #e37318;
    font-weight: 600;
    font-size: 14px;
  }

  .notice-desc {
    font-size: 12px;
    color: #4e5969;
    font-weight: 400;
  }
}

:deep(.form-container) {
  padding: 12px 16px;

  .t-form {
    border-radius: 16px;
  }

  .t-form__label {
    font-size: 15px;
    color: #4e5969;
    font-weight: 500;
  }

  .t-input__control,
  .t-input__control--disabled {
    font-size: 15px;
    font-weight: 500;
    color: #171a1d;
    pointer-events: none; // 解决 disabled input 拦截点击事件冒泡的问题
  }
}

.form-submit-action {
  width: 100%;
  margin-top: 16px;
}
</style>
