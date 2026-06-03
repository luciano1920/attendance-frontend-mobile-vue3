<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/UserLoginPage.vue
 * @Description  : 用户登录页面
-->
<template>
  <div id="user-login-page">
    <t-button theme="light" shape="circle" @click="router.push('/auth')">
      <template #icon>
        <SvgIcon name="arrow-left" size="20px" />
      </template>
    </t-button>

    <div class="login-header">
      <div class="header-title">
        <div class="title">欢迎回来</div>
        <div class="desc">登录你的考勤系统</div>
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
      <t-form-item label="账号" name="username">
        <t-input v-model="formData.username" borderless placeholder="请输入工号">
          <template #prefixIcon>
            <SvgIcon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="密码" name="password">
        <t-input v-model="formData.password" borderless type="password" placeholder="请输入密码">
          <template #prefixIcon>
            <SvgIcon name="lock" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="验证码" name="smsCode">
        <t-input v-model="formData.smsCode" borderless placeholder="请输入验证码">
          <template #prefixIcon>
            <SvgIcon name="smartphone" />
          </template>
          <template #suffix>
            <!-- 倒计时按钮组件 -->
            <SmsCountDownButton
              ref="smsCountDownRef"
              :disabled="!formData.username"
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

      <t-button size="large" theme="primary" type="submit" class="form-submit">立即登录</t-button>
    </t-form>

    <div class="tips">
      <!-- <t-link theme="primary" @click="router.push('/auth/register')">注册账号</t-link> -->
      忘记密码？
      <t-link theme="primary" @click="router.push('/auth/forgot')">重置密码</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, type SubmitContext } from 'tdesign-mobile-vue'

import { useUserStore } from '@/stores/user-store'
import { initMfaLoginUsingPost, verifyMfaLoginUsingPost } from '@/api/auth-controller'
import SvgIcon from '@/components/SvgIcon.vue'
import CaptchaWrapper from '@/components/captcha/CaptchaWrapper.vue'
import SmsCountDownButton from '@/components/SmsCountDownButton.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface FormData {
  challengeId?: string
  username?: string
  password?: string
  smsCode?: string
  captchaVerification?: string
}

const formData = reactive<FormData>({})
const rules = {
  username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const smsCountDownRef = ref()
const captchaWrapperRef = ref()

/** 发送验证码前，进行图形滑动人机验证 */
const sendSmsVerificationCode = () => {
  captchaWrapperRef.value?.show()
}

/**
 * 图形滑动验证成功回调
 * @param captchaVerification 图形验证码的加密信息
 */
const captchaSuccess = async (params: { captchaVerification: string }) => {
  formData.captchaVerification = params.captchaVerification

  let requestParams: FormData = {}
  if (!formData.challengeId) {
    requestParams = {
      captchaVerification: formData.captchaVerification,
      username: formData.username,
      password: formData.password,
    }
  } else {
    requestParams = {
      challengeId: formData.challengeId,
    }
  }

  const res = await initMfaLoginUsingPost(requestParams)
  if (res.data.code === 0 && res.data.data) {
    formData.challengeId = res.data.data.challengeId
    Message.success({ content: `验证码已发送到 ${res.data.data.maskedPhone}`, offset: [10, 16] })
    smsCountDownRef.value?.beginCountdown() // 启动倒计时
  } else {
    formData.challengeId = undefined
    Message.error({
      content: res.data.msg,
      offset: [10, 16],
    })
  }
}

/**
 * 执行登录
 * @param context 表单提交上下文
 */
const handleSubmit = async (context: SubmitContext<FormData>) => {
  if (context.validateResult === true) {
    const res = await verifyMfaLoginUsingPost({
      smsCode: formData.smsCode,
      challengeId: formData.challengeId,
    })
    if (res.data.code === 0 && res.data.data) {
      userStore.setLoginUserInfo({
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
        expiresTime: res.data.data.expiresTime,
      })
      userStore.fetchLoginUserInfo()
      // 判断是否有重定向地址，如果有则跳转到该地址，否则跳转到首页
      router.push({
        path: (route.query.redirect as string) ?? '/',
        replace: true,
      })
    } else {
      Message.error({
        content: '登录失败，' + res.data.msg,
        offset: [10, 16],
      })
    }
  }
}
</script>

<style scoped lang="scss">
#user-login-page {
  display: flex;
  flex-direction: column;
  padding: 32px;

  background: url('@/assets/svgs/bg/login.svg');
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
    padding: 0 8px;
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
