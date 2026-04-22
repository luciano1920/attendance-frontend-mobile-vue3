<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-19 14:46
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 00:29
 * @FilePath     : \attendance-frontend-mobile\src\pages\auth\UserForgotPage.vue
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
      show-error-message
      label-align="top"
      scroll-to-first-error="auto"
      @submit="handleSubmit"
    >
      <t-form-item label="手机号" name="username">
        <t-input v-model="formData.username" borderless placeholder="请输入绑定的手机号">
          <template #prefixIcon>
            <SvgIcon name="smartphone" />
          </template>
          <template #suffix>
            <t-button style="font-weight: 500" size="extra-small" theme="primary" variant="text">
              发送验证码
            </t-button>
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="验证码" name="phoneCode">
        <t-input v-model="formData.phoneCode" borderless placeholder="请输入验证码">
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

      <t-form-item label="确认新密码" name="password">
        <t-input
          v-model="formData.password"
          borderless
          type="password"
          placeholder="请输入确认密码"
        >
          <template #prefixIcon>
            <SvgIcon name="lock" />
          </template>
        </t-input>
      </t-form-item>

      <t-button size="large" theme="primary" type="submit" class="form-submit">确认修改</t-button>
    </t-form>

    <div class="tips">
      已有账号？
      <t-link theme="primary" @click="router.push('/auth/login')">去登陆</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()

interface FormData {
  username?: string
  password?: string
  phoneCode?: string
}

const formData = reactive<FormData>({})

const handleSubmit = async (fields: FormData) => {
  router.replace('/auth')
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
