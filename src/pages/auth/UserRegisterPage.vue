<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 22:05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-29 10:54
 * @FilePath     : \attendance-frontend-mobile\src\pages\auth\UserRegisterPage.vue
 * @Description  : 用户注册页面
-->
<template>
  <div id="user-register-page">
    <t-button theme="light" shape="circle" @click="router.push('/auth')">
      <template #icon>
        <SvgIcon name="arrow-left" size="20px" />
      </template>
    </t-button>

    <div class="logo">
      <SvgIcon name="fingerprint-pattern" color="#fff" size="36px" />
    </div>

    <div class="title">创建账号</div>
    <div class="desc">{{ systemDescription }}</div>

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
            <SvgIcon name="smartphone" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="密码" name="password">
        <t-input
          v-model="formData.password"
          borderless
          type="password"
          placeholder="请输入用户密码"
        >
          <template #prefixIcon>
            <SvgIcon name="lock" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item label="验证码" name="phoneCode">
        <t-input v-model="formData.phoneCode" borderless placeholder="请输入验证码">
          <template #prefixIcon>
            <SvgIcon name="shield-check" />
          </template>
          <template #suffix>
            <t-button
              style="color: #155dfb; font-weight: 500"
              size="extra-small"
              theme="primary"
              variant="text"
            >
              发送验证码
            </t-button>
          </template>
        </t-input>
      </t-form-item>

      <t-button size="large" theme="primary" type="submit" class="form-submit">注 册</t-button>
    </t-form>

    <div class="tips">
      已有账号？
      <t-link @click="router.push('/auth/login')" class="tips-link">去登陆</t-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const systemDescription = import.meta.env.VITE_APP_DESCRIPTION

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
#user-register-page {
  display: flex;
  flex-direction: column;
  padding: 48px 32px;

  .logo {
    background-color: #0052D9;
    box-shadow: 0 6px 16px rgba(21, 93, 251, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 20px;
    padding: 8px;
    margin-top: 24px;
    transform: rotate(-7deg);
  }

  .title {
    font-size: 30px;
    font-weight: 700;
    color: #001442;
    margin-top: 24px;
    margin-bottom: 6px;
  }

  .desc {
    font-size: 15px;
    color: #62748e;
    margin-bottom: 24px;
  }

  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    font-size: 14px;
    color: #62748e;

    .tips-link {
      color: #155dfb;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
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

:deep(.t-form__item) {
  padding: 0;
  margin-bottom: 24px;

  &::after {
    display: none;
  }

  .t-form__label {
    color: #535d6d;
    font-size: 14px;
  }
}

:deep(.t-input) {
  background-color: #f3f3f4;
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
