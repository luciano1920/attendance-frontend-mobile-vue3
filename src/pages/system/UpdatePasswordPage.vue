<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/UpdatePasswordPage.vue
 * @Description  : 用户修改密码页面
-->
<template>
  <div id="update-password-page">
    <!-- 表单页头部 -->
    <div class="form-header">
      <AppSvgIcon name="chevron-left" size="22px" @click="router.push('/settings')" />
      <div class="form-title">
        <div class="form-name">修改密码</div>
        <div class="form-desc">设置新的登录密码，保护您的账户安全</div>
      </div>
    </div>

    <!-- 表单须知 -->
    <div class="notice-bar">
      <AppSvgIcon name="triangle-alert" size="15px" color="#E37318" style="margin-top: 2px" />
      <div class="notice-content">
        <div class="notice-title">密码安全须知</div>
        <div class="notice-desc">密码修改后请妥善保管，建议定期修改以保障账户安全。</div>
      </div>
    </div>

    <!-- 表单主体 -->
    <div class="form-container">
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
        <t-form-item label="旧密码" content-align="right" name="oldPassword">
          <t-input
            v-model="formData.oldPassword"
            align="right"
            borderless
            type="password"
            placeholder="请输入旧密码"
          />
        </t-form-item>

        <t-form-item label="新密码" content-align="right" name="newPassword">
          <t-input
            v-model="formData.newPassword"
            align="right"
            borderless
            type="password"
            placeholder="请输入新密码"
          />
        </t-form-item>
      </t-form>

      <t-button size="large" @click="handleSubmit" class="form-submit-action">确认修改</t-button>
    </div>

    <div class="tips">
      忘记密码？
      <t-link theme="primary" @click="router.push('/auth/forgot')">去重置密码</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { updateUserPasswordUsingPut } from '@/api/user-controller'
import AppSvgIcon from '@/components/AppSvgIcon.vue'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formData = reactive({
  oldPassword: '',
  newPassword: '',
})
// 表单组件实例
const formRef = ref()

// 表单校验规则
const rules = {
  oldPassword: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度须为6-16位', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' },
    {
      validator: (value: string) => {
        if (value === formData.oldPassword) {
          return {
            result: false,
            message: '新密码和旧密码不能相同',
            type: 'error',
          }
        }
        return true
      },
      trigger: 'blur',
    },
  ],
}

/** 提交表单 */
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid !== true) {
      return
    }

    const res = await updateUserPasswordUsingPut(formData)
    if (res.data.code === 0) {
      Message.success({ content: '修改密码成功，请重新登录', offset: [10, 16] })
      userStore.resetUserState()
      router.replace('/auth/login')
    } else {
      Message.error({ content: res.data.msg, offset: [10, 16] })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped lang="scss">
.form-header {
  background: url('@/assets/svgs/bg/update.svg');
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
  }
}

.form-submit-action {
  --td-button-default-bg-color: #535d6d;
  --td-button-default-border-color: #535d6d;
  --td-button-default-color: #fff;
  --td-button-default-active-bg-color: #424a57;
  --td-button-default-active-border-color: #424a57;

  width: 100%;
  margin: 16px 0;
}

.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #62748e;
}
</style>
