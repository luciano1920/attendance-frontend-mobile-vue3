<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/apply/MakeupFormPage.vue
 * @Description  : 补卡申请表单页面
-->
<template>
  <div id="makeup-form-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <AppSvgIcon name="chevron-left" size="22px" @click="router.push('/apply')" />
      <div class="form-title">
        <div class="form-name">补卡申请</div>
        <div class="form-desc">申请补录缺失的打卡记录</div>
      </div>
    </div>

    <!-- 表单须知 -->
    <div class="notice-bar">
      <AppSvgIcon name="triangle-alert" size="15px" color="#E37318" style="margin-top: 2px" />
      <div class="notice-content">
        <div class="notice-title">补卡须知</div>
        <div class="notice-desc">补卡较多会被考核通报，需在缺卡次月5日前完成申请。</div>
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

        <t-form-item label="补卡类型" name="attenCorrectionType" content-align="right">
          <AppRadioButtonGroup
            v-model="formData.attenCorrectionType"
            :options="makeupTypeOptions"
            theme="red"
          />
        </t-form-item>

        <t-form-item
          arrow
          label="补卡日期"
          name="attenCorrectionTime"
          content-align="right"
          @click="makeupCalendarRef.showCalendar()"
        >
          <t-input
            :value="missingDateNote"
            borderless
            align="right"
            disabled
            placeholder="点击选择补卡日期"
          />
          <MakeupCalendar
            ref="makeupCalendarRef"
            :record-data="missingRecordDataList"
            :on-confirm="confirmMakeupDate"
          />
        </t-form-item>

        <t-form-item label="补卡天数" name="applyDays" content-align="right">
          <t-input :value="applyDays" borderless align="right" disabled suffix="天" type="number" />
        </t-form-item>

        <t-form-item label="补卡原因" name="attenCorrectionReason" content-align="right">
          <t-textarea
            v-model="formData.attenCorrectionReason"
            placeholder="请输入补卡原因"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>
      </t-form>

      <t-button theme="danger" size="large" @click="handleSubmit" class="form-submit-action">
        提交申请
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, type RadioOptionObj } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { createMakeupApplyUsingPost } from '@/api/apply-controller'
import { fetchApproversListUsingGet } from '@/api/approve-controller'
import { fetchDictOptionsListUsingGet } from '@/api/dict-controller'
import { fetchAllowMakeupDayUsingPost } from '@/api/record-controller'
import { usePicker, type PickerOptionsMap } from '@/composables/usePicker'
import AppSvgIcon from '@/components/AppSvgIcon.vue'
import AppRadioButtonGroup from '@/components/AppRadioButtonGroup.vue'
import MakeupCalendar from './components/MakeupCalendar.vue'

const router = useRouter()

const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

// 表单数据
const formData = reactive({
  checkPartyAccount: '',
  attenCorrectionType: '',
  attenCorrectionReason: '',
  attenCorrectionTime: [] as string[],
})
// 表单组件实例
const formRef = ref()

// 表单校验规则
const rules = {
  checkPartyAccount: [{ required: true, message: '请选择审批人', trigger: 'change' }],
  attenCorrectionType: [{ required: true, message: '请选择补卡类型', trigger: 'change' }],
  attenCorrectionTime: [{ required: true, message: '请选择补卡日期', trigger: 'change' }],
  attenCorrectionReason: [
    { required: true, message: '请输入补卡原因', trigger: 'blur' },
    { max: 250, message: '补卡原因不超过 250 字', trigger: 'blur' },
  ],
}

// 补卡类型选项列表
const makeupTypeOptions = ref<RadioOptionObj[]>([])

// usePicker 组合式函数需要的选项数据
const pickerOptions = ref<PickerOptionsMap>({
  checkPartyAccount: [],
})

// 采用封装好的 Picker 组合式钩子函数
const picker = usePicker(formData, pickerOptions.value)

// 缺卡日期记录数据列表
const missingRecordDataList = ref<any[]>([])
// 缺卡日期字符串
const missingDateNote = ref<string>('')
// 补卡日历弹出层实例
const makeupCalendarRef = ref()
// 补卡申请天数
const applyDays = ref<number>(0)

/** 获取可以补卡的日期列表 */
const getAllowMakeupDayList = async () => {
  const res = await fetchAllowMakeupDayUsingPost()
  if (res.data.code === 0 && res.data.data) {
    missingRecordDataList.value = res.data.data
  } else {
    Message.error({
      content: res.data.msg || '获取可补卡日期列表失败',
      offset: [10, 16],
    })
  }
}

/**
 * 日历组件确认选择回调函数
 * @param dateList 选择的日期列表
 */
const confirmMakeupDate = (dateList: string[]) => {
  applyDays.value = dateList.length
  formData.attenCorrectionTime = dateList
  missingDateNote.value = dateList.join('、')
}

/** 获取审批人选项列表 */
const getApproverList = async () => {
  const res = await fetchApproversListUsingGet()
  if (res.data.data && res.data.code === 0) {
    pickerOptions.value.checkPartyAccount = res.data.data.map((item: any) => {
      return { label: item.nickname, value: item.partyAccount }
    })
  }
}

/** 获取补卡类型选项列表 */
const getMakeupTypeList = async () => {
  const res = await fetchDictOptionsListUsingGet({ type: 'attencorrection_order_type' })
  if (res.data.code === 0 && res.data.data) {
    makeupTypeOptions.value = res.data.data.map((item: any) => {
      return { label: item.label, value: item.value }
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

    const res = await createMakeupApplyUsingPost(formData)
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
  getMakeupTypeList()
  getAllowMakeupDayList()
})
</script>

<style scoped lang="scss">
.form-header {
  background: url('@/assets/svgs/bg/makeup.svg');
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
  margin: 16px 0;
}
</style>
