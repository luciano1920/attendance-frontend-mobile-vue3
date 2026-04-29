<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-26 10:28
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-29 11:31
 * @FilePath     : \attendance-frontend-mobile\src\pages\apply\FaceUpdateFormPage.vue
 * @Description  : 人脸变更申请表单页面
-->
<template>
  <div id="face-update-form-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <SvgIcon name="chevron-left" size="22px" @click="router.push('/apply')" />
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
          name="deptCheckerPartyAccount"
          content-align="right"
          @click="picker.open('deptCheckerPartyAccount', '选择审批人')"
        >
          <t-input
            :value="picker.getLabel('deptCheckerPartyAccount')"
            borderless
            align="right"
            disabled
            placeholder="点击选择审批人"
          />
        </t-form-item>
      </t-form>

      <div class="face-update-wrapper">
        <div class="face-update-title">请上传清晰的正面人脸照片</div>
        <!-- 人脸上传组件 -->
        <PictureUpload
          class="face-update-action"
          :max-count="1"
          :success-upload="handleSuccess"
          :remove-upload="handleRemove"
        />
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
            <div class="tips-desc">图片格式支持 jpg, png, jpeg，大小不超过 10MB</div>
          </div>
        </div>
      </div>

      <t-button size="large" @click="handleSubmit" class="form-submit-action">提交申请</t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user-store'
import { fetchApproversListUsingGet } from '@/api/approve-controller'
import { usePicker, type PickerOptionsMap } from '@/composables/usePicker'
import SvgIcon from '@/components/SvgIcon.vue'
import PictureUpload from '@/components/PictureUpload.vue'
import { createFaceUpdateApplyUsingPost } from '@/api/apply-controller'
import { Message } from 'tdesign-mobile-vue'

const router = useRouter()

const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

// 表单数据
const formData = reactive({
  deptCheckerNickname: '',
  deptCheckerPartyAccount: '',
  fileUrl: '',
})
// 表单组件实例
const formRef = ref()

// 表单校验规则
const rules = {
  deptCheckerPartyAccount: [{ required: true, message: '请选择审批人', trigger: 'change' }],
}

// usePicker 组合式函数需要的选项数据
const pickerOptions = ref<PickerOptionsMap>({
  deptCheckerPartyAccount: [],
})

// 采用封装好的 Picker 组合式钩子函数
const picker = usePicker(formData, pickerOptions.value)

/** 获取审批人选项列表 */
const getApproverList = async () => {
  const res = await fetchApproversListUsingGet()
  if (res.data.data && res.data.code === 0) {
    pickerOptions.value.deptCheckerPartyAccount = res.data.data.map((item: any) => {
      return { label: item.nickname, value: item.partyAccount }
    })
  }
}

/**
 * 上传附件成功的回调
 * @param fileList 上传附件列表
 */
const handleSuccess = (fileList: any) => {
  formData.fileUrl = fileList.map((item: any) => item.url).toString()
}

/**
 * 移除上传附件的回调
 * @param fileList 上传附件列表
 */
const handleRemove = (fileList: any) => {
  formData.fileUrl = fileList.map((item: any) => item.url).toString()
}

/** 提交表单 */
const handleSubmit = async () => {
  // 检查是否已上传人脸照片
  if (!formData.fileUrl) {
    Message.error({ content: '请上传人脸照片', offset: [10, 16] })
    return
  }

  if (formData.deptCheckerPartyAccount) {
    formData.deptCheckerNickname = picker.getLabel('deptCheckerPartyAccount')
  }

  try {
    const valid = await formRef.value.validate()
    if (valid !== true) {
      return
    }

    const res = await createFaceUpdateApplyUsingPost(formData)
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
  gap: 8px;

  .face-update-title {
    font-size: 14px;
    color: #4e5969;
    font-weight: 500;
  }

  .face-update-action {
    --td-upload-add-icon-size: 0; // 隐藏默认的上传图标
    --td-upload-width: 200px;
    --td-upload-height: 200px;
    --td-upload-grid-columns: 1;
    --td-upload-background: url('@/assets/svgs/bg/face-upload.svg') center / 100% 100% no-repeat;
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
  margin: 16px 0;
}
</style>
