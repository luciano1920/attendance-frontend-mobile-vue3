<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 22:04
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-19 15:05
 * @FilePath     : \attendance-frontend-mobile\src\pages\auth\UserLoginPage.vue
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
      show-error-message
      label-align="top"
      scroll-to-first-error="auto"
      @submit="handleSubmit"
    >
      <t-form-item label="账号" name="username">
        <t-input v-model="formData.username" borderless placeholder="请输入工号或手机号">
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

      <t-form-item label="验证码" name="code">
        <t-input v-model="formData.code" borderless placeholder="请输入验证码">
          <template #prefixIcon>
            <SvgIcon name="smartphone" />
          </template>
          <template #suffix>
            <t-button
              style="font-weight: 500"
              size="extra-small"
              theme="primary"
              variant="text"
              @click="sendSmsVerificationCode"
            >
              发送验证码
            </t-button>

            <!-- 滑动验证弹窗组件 -->
            <!-- <SliderVerify ref="verifyDialogRef" :verify="verifySuccess" /> -->
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
      <t-link theme="primary" @click="router.push('/auth/register')">注册账号</t-link>
      <t-link theme="primary" @click="router.push('/auth/forgot')">忘记密码？</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import SliderVerify from '@/components/SliderVerify.vue'
import {
  fetchSmsVerificationCodeUsingGet,
  loginWithSmsVerificationCode
} from '@/api/auth-controller'
import { fetchApproverInfoUsingGet } from '@/api/user-controller'
import { useUserStore } from '@/stores/user-store'
import { rsaEncrypt } from '@/libs/jsencrypt/rsa'
import SvgIcon from '@/components/SvgIcon.vue'
import CaptchaWrapper from '@/components/captcha/CaptchaWrapper.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

interface FormData {
  username?: string
  password?: string
  code?: string
  captchaVerification?: string
}

const formData = reactive<FormData>({})

const verifyDialogRef = ref()
const captchaWrapperRef = ref()

const sendSmsVerificationCode = () => {
  // verifyDialogRef.value?.open()
  captchaWrapperRef.value.show()
}

// /**
//  * 图形滑动验证成功回调
//  * @param captchaVerification 图形验证码的加密信息
//  */
// const verifySuccess = async (captchaVerification: any) => {
//   verifyDialogRef.value?.close()
//   // 发送验证码
//   formData.captchaVerification = captchaVerification
//   const res = await fetchSmsVerificationCodeUsingGet({
//     captchaVerification,
//     mobile: formData.username,
//     scene: 1
//   })
//   if (res.data.code === 0) {
//     Message.success('验证码发送成功')
//   } else {
//     Message.error(res.data.msg)
//   }
// }

/**
 * 图形滑动验证成功回调
 * @param captchaVerification 图形验证码的加密信息
 */
const captchaSuccess = async (params: { captchaVerification: string }) => {
  // 发送验证码
  formData.captchaVerification = params.captchaVerification
  const res = await fetchSmsVerificationCodeUsingGet({
    captchaVerification: params.captchaVerification,
    mobile: formData.username,
    scene: 1
  })
  if (res.data.code === 0) {
    Message.success('验证码发送成功')
  } else {
    Message.error(res.data.msg)
  }
}

/** 执行登录 */
const handleSubmit = async () => {
  const res_login = await loginWithSmsVerificationCode({
    mobile: formData.username, // TODO：这里后端拼写错误，后期要改为：mobile -> username
    password: rsaEncrypt(formData.password as string),
    code: formData.code,
    captchaVerification: formData.captchaVerification,
    sence: 1 // TODO: 这里后端拼写错误，后期要改为：sence -> scene
  })
  if (res_login.data.code === 0 && res_login.data.data) {
    userStore.setLoginUserInfo({
      accessToken: res_login.data.data.accessToken,
      refreshToken: res_login.data.data.refreshToken,
      expiresTime: res_login.data.data.expiresTime
    })
    userStore.fetchLoginUserInfo()

    const res_approver = await fetchApproverInfoUsingGet()
    if (res_approver.data.code === 0 && res_approver.data.data) {
      const loginUser = userStore.loginUser
      loginUser.userInfo.approver = res_approver.data.data
      userStore.setLoginUserInfo(loginUser)
    }

    // 判断是否有重定向地址，如果有则跳转到该地址，否则跳转到首页
    router.push({
      path: (route.query.redirect as string) ?? '/',
      replace: true
    })
  } else {
    Message.error('登录失败，' + res_login.data.msg)
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
    justify-content: space-between;
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
