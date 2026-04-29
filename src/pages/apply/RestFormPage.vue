<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-26 10:28
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-27 16:10
 * @FilePath     : \attendance-frontend-mobile\src\pages\apply\RestFormPage.vue
 * @Description  : 调休申请表单页面
-->
<template>
  <div id="rest-form-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <SvgIcon name="chevron-left" size="22px" @click="router.push('/apply')" />
      <div class="form-title">
        <div class="form-name">调休申请</div>
        <div class="form-desc">合理调配休假时间</div>
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
      <TimeRangePickerPopup ref="timeRangePickerRef" v-model="formData.compLeaveTime" />

      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        show-error-message
        label-align="left"
        label-width="auto"
        scroll-to-first-error="smooth"
        :required-mark="false"
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

        <t-form-item
          arrow
          label="调休开始时间"
          name="compLeaveTime.0.startTime"
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
          label="调休结束时间"
          name="compLeaveTime.0.endTime"
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

        <t-form-item label="调休原因" name="compLeaveReason" content-align="right">
          <t-textarea
            v-model="formData.compLeaveReason"
            placeholder="请输入调休原因"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>
      </t-form>

      <t-button size="large" @click="handleSubmit" class="form-submit-action">提交申请</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { createRestApplyUsingPost } from '@/api/apply-controller'
import { fetchApproversListUsingGet } from '@/api/approve-controller'
import { usePicker, type PickerOptionsMap } from '@/composables/usePicker'
import SvgIcon from '@/components/SvgIcon.vue'
import TimeRangePickerPopup from './components/TimeRangePickerPopup.vue'

const router = useRouter()

const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

// 表单数据
const formData = reactive({
  checkPartyAccount: '',
  compLeaveReason: '',
  compLeaveTime: [{ startTime: '', endTime: '' }],
})
// 表单组件实例
const formRef = ref()

// 表单校验规则
const rules = {
  checkPartyAccount: [{ required: true, message: '请选择审批人', trigger: 'change' }],
  'compLeaveTime.0.startTime': [
    { required: true, message: '请选择调休开始时间', trigger: 'change' },
  ],
  'compLeaveTime.0.endTime': [{ required: true, message: '请选择调休结束时间', trigger: 'change' }],
  compLeaveReason: [
    { required: true, message: '请输入调休原因', trigger: 'blur' },
    { max: 250, message: '调休原因不超过 250 字', trigger: 'blur' },
  ],
}

// usePicker 组合式函数需要的选项数据
const pickerOptions = ref<PickerOptionsMap>({
  checkPartyAccount: [],
})

// 采用封装好的 Picker 组合式钩子函数
const picker = usePicker(formData, pickerOptions.value)

const timeRangePickerRef = ref<InstanceType<typeof TimeRangePickerPopup>>()

/** 获取审批人选项列表 */
const getApproverList = async () => {
  const res = await fetchApproversListUsingGet()
  if (res.data.data && res.data.code === 0) {
    pickerOptions.value.checkPartyAccount = res.data.data.map((item: any) => {
      return { label: item.nickname, value: item.partyAccount }
    })
  }
}

/** 提交表单 */
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid !== true) {
      return
    }

    const res = await createRestApplyUsingPost(formData)
    if (res.data.code === 0) {
      Message.success({ content: '提交成功', offset: [10, 16] })
      router.push('/apply')
    } else {
      Message.error({ content: res.data.msg, offset: [10, 16] })
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getApproverList()
})
</script>

<style scoped lang="scss">
.form-header {
  background: url('@/assets/svgs/bg/rest.svg');
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
  padding: 16px 16px;
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
  --td-button-default-bg-color: #2ba471;
  --td-button-default-border-color: #2ba471;
  --td-button-default-color: #fff;
  --td-button-default-active-bg-color: #006c45;
  --td-button-default-active-border-color: #006c45;

  width: 100%;
  margin: 16px 0;
}
</style>
