<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-26 10:28
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-26 11:24
 * @FilePath     : \attendance-frontend-mobile\src\pages\apply\FaceUpdateFormPage.vue
 * @Description  : 人脸变更申请表单页面
-->
<template>
  <div id="face-update-form-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <SvgIcon name="chevron-left" size="22px" @click="$router.push('/apply')" />
      <div class="form-title">
        <div class="form-name">人脸录入</div>
        <div class="form-desc">录入人脸，开启智能打卡</div>
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
      </t-form>

      <div class="face-update-wrapper">
        <div class="face-update-title">请上传清晰的正面人脸照片</div>
        <div class="face-update-action"></div>
        <div class="face-update-tips">
          <div class="tips-item">
            <SvgIcon name="check-circle" color="#8B5CF6" size="13px" />
            <div class="tips-desc">请确保光线充足，面部清晰</div>
          </div>
          <div class="tips-item">
            <SvgIcon name="check-circle" color="#8B5CF6" size="13px" />
            <div class="tips-desc">不得佩戴口罩、墨镜等遮挡物</div>
          </div>
          <div class="tips-item">
            <SvgIcon name="check-circle" color="#8B5CF6" size="13px" />
            <div class="tips-desc">图片格式 JPG/PNG，不超过 5MB</div>
          </div>
        </div>
      </div>

      <t-button size="large" @click="handleSubmit" class="form-submit-action">提交申请</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Form } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { fetchApproversUsingGet } from '@/api/approve-controller'
import { usePicker, type PickerOptionsMap } from '@/composables/usePicker'
import SvgIcon from '@/components/SvgIcon.vue'

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

const pickerOptions = ref<PickerOptionsMap>({
  checkPartyAccount: [],
  leaveProxyPartyAccount: [],
})

// 采用封装好的 Picker 组合式钩子函数
const picker = usePicker(formData, pickerOptions.value)

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

/** 提交表单 */
const handleSubmit = () => {
  console.log('提交给后端的完整 formData:', formData)
}

onMounted(() => {
  getApproverList()
})
</script>

<style scoped lang="scss">
.form-header {
  background: url('@/assets/svgs/bg/face.svg');
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

.face-update-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 16px;

  .face-update-title {
    font-size: 14px;
    color: #4e5969;
    font-weight: 500;
  }

  .face-update-action {
    background: url('../../assets/svgs/bg/face-upload.svg');
    background-repeat: no-repeat;
    background-size: 100%;
    height: 200px;
    width: 200px;
  }

  .face-update-tips {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 12px 16px;
    width: 100%;
    background-color: #f3effe;
    border-radius: 12px;

    .tips-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .tips-desc {
        font-size: 13px;
        color: #4e5969;
      }
    }
  }
}

.form-submit-action {
  --td-button-default-bg-color: #8b5cf6;
  --td-button-default-border-color: #8b5cf6;
  --td-button-default-color: #fff;
  --td-button-default-active-bg-color: #7137bf;
  --td-button-default-active-border-color: #7137bf;

  width: 100%;
  margin-top: 16px;
}
</style>
