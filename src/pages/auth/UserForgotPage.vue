<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/UserForgotPage.vue
 * @Description  : 用户忘记密码页
-->
<template>
  <div id="user-forgot-page">
    <t-button theme="light" shape="circle" @click="router.push('/auth')">
      <template #icon>
        <SvgIcon name="arrow-left" size="20px" />
      </template>
    </t-button>

    <div class="login-header">
      <div class="header-title">
        <div class="title">重置密码</div>
        <div class="desc">通过手机验证码重置你的密码</div>
      </div>

      <div class="logo">
        <SvgIcon name="fingerprint-pattern" color="#fff" size="36px" />
      </div>
    </div>

    <t-form
      :data="formData"
      :rules="rules"
      :required-mark="false"
      show-error-message
      label-align="top"
      scroll-to-first-error="auto"
      @submit="handleSubmit"
    >
      <t-form-item label="手机号" name="mobile">
        <t-input v-model="formData.mobile" borderless placeholder="请输入绑定手机号">
          <template #prefixIcon>
            <SvgIcon name="smartphone" />
          </template>
          <template #suffix>
            <!-- 倒计时按钮组件 -->
            <SmsCountDownButton
              ref="smsCountDownRef"
              :disabled="!formData.mobile"
              @send="sendSmsVerificationCode"
            />

            <!-- 滑动验证弹窗组件 -->
            <CaptchaWrapper
              ref="captchaWrapperRef"
              captchaType="blockPuzzle"
              :imgSize="{ width: '300px', height: '200px' }"
              mode="pop"
              @success="captchaSuccess"
            />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="验证码" name="code">
        <t-input v-model="formData.code" borderless placeholder="请输入验证码">
          <template #prefixIcon>
            <SvgIcon name="key-round" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="新密码" name="password">
        <t-input v-model="formData.password" borderless type="password" placeholder="请输入新密码">
          <template #prefixIcon>
            <SvgIcon name="lock" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="确认新密码" name="finalPassword">
        <t-input
          v-model="formData.finalPassword"
          borderless
          type="password"
          placeholder="请输入确认密码"
        >
          <template #prefixIcon>
            <SvgIcon name="lock-keyhole" />
          </template>
        </t-input>
      </t-form-item>

      <t-button size="large" theme="primary" type="submit" class="form-submit">确认重置</t-button>
    </t-form>

    <div class="tips">
      已有账号？
      <t-link theme="primary" @click="router.push('/auth/login')">去登陆</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message, type SubmitContext } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import {
  fetchSmsVerificationCodeUsingGet,
  resetPasswordWithSmsUsingPost,
} from '@/api/auth-controller'
import SvgIcon from '@/components/SvgIcon.vue'
import CaptchaWrapper from '@/components/captcha/CaptchaWrapper.vue'
import SmsCountDownButton from '@/components/SmsCountDownButton.vue'

const router = useRouter()
const userStore = useUserStore()

interface FormData {
  mobile?: string
  password?: string
  finalPassword?: string
  code?: string
  captchaVerification?: string
}

const formData = reactive<FormData>({})
const rules = {
  mobile: [{ required: true, message: '请输入工号或手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  finalPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const smsCountDownRef = ref() // 验证码倒计时按钮组件实例
const captchaWrapperRef = ref() // 滑动验证弹窗组件实例

/** 发送验证码前，进行图形滑动人机验证 */
const sendSmsVerificationCode = () => {
  captchaWrapperRef.value?.show()
}

/**
 * 图形滑动验证成功回调
 * @param captchaVerification 图形验证码的加密信息
 */
const captchaSuccess = async (params: { captchaVerification: string }) => {
  // 发送验证码
  formData.captchaVerification = params.captchaVerification
  const res = await fetchSmsVerificationCodeUsingGet({
    captchaVerification: params.captchaVerification,
    mobile: formData.mobile,
    scene: 23, // 重置密码的场景编号是 23（来自后端验证码场景枚举类）
  })
  if (res.data.code === 0) {
    Message.success({ content: '验证码发送成功', offset: [10, 16] })
    smsCountDownRef.value?.beginCountdown() // 启动倒计时
  } else {
    Message.error({
      content: res.data.msg,
      offset: [10, 16],
    })
  }
}

/**
 * 执行密码重置
 * @param context 表单提交上下文
 */
const handleSubmit = async (context: SubmitContext<FormData>) => {
  if (formData.password !== formData.finalPassword) {
    Message.error({ content: '两次输入的密码不一致', offset: [10, 16] })
    return
  }

  if (context.validateResult === true) {
    const res = await resetPasswordWithSmsUsingPost({
      mobile: formData.mobile,
      password: formData.password,
      finalPassword: formData.finalPassword,
      code: formData.code,
    })
    if (res.data.code === 0 && res.data.data) {
      // 如果本地已有用户登录信息，则重置用户登录信息
      if (userStore.loginUser.accessToken) {
        userStore.resetUserState()
      }
      Message.success({ content: '密码重置成功', offset: [10, 16] })
      // 去账号密码登录页
      router.replace('/auth/login')
    } else {
      Message.error({
        content: '密码重置失败，' + res.data.msg,
        offset: [10, 16],
      })
    }
  }
}
</script>

<style scoped lang="scss">
#user-forgot-page {
  display: flex;
  flex-direction: column;
  padding: 32px;

  background: url('@/assets/svgs/bg/forgot.svg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top;

  .login-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0 32px;

    .header-title {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .title {
        font-size: 30px;
        font-weight: 700;
        color: #001442;
      }

      .desc {
        font-size: 15px;
        color: #62748e;
      }
    }

    .logo {
      background-color: #0052d9;
      box-shadow: 0 6px 16px rgba(21, 93, 251, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 20px;
      padding: 8px;
      transform: rotate(-7deg);
    }
  }

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #62748e;
  }

  .form-submit {
    width: 100%;
    margin: 16px 0;
    box-shadow: 0 6px 16px rgba(21, 93, 251, 0.3);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.98);
    }
  }
}

.t-form {
  background: transparent;
}

:deep(.t-form__item) {
  padding: 0;
  margin-bottom: 16px;

  &::after {
    display: none;
  }

  .t-form__label {
    color: #535d6d;
    font-size: 14px;
    padding-bottom: 4px;
    padding-left: 4px;
  }
}

:deep(.t-input) {
  // background-color: #f3f3f4;
  border: 1px solid #e7e8eb;
  border-radius: 16px;
  padding: 12px;
  height: 24px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #8eabff;
    box-shadow: 0 0 0 2px rgba(21, 93, 251, 0.1);
  }

  .t-input__icon--prefix {
    color: #858a99;
    font-size: 18px;
  }

  .t-input__content::placeholder {
    color: #858a99;
  }
}
</style>
