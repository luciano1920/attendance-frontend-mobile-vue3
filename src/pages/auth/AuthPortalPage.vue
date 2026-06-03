<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/AuthPortalPage.vue
 * @Description  : 系统认证登录门户页
-->
<template>
  <div id="auth-page">
    <div class="system-logo">
      <SvgIcon name="fingerprint-pattern" color="#fff" size="44px" />
    </div>

    <div class="system-title">{{ systemTitle }}</div>
    <div class="system-desc">{{ systemDescription }}</div>
    <div class="system-slogan">
      <SvgIcon name="check-circle" />
      {{ systemSlogan }}
    </div>

    <div class="auth-action">
      <t-button
        theme="primary"
        size="large"
        :loading="loginStatus"
        :disabled="loginStatus"
        style="width: 90%; gap: 8px"
        @click="getTelecomLoginUrl"
      >
        <template #icon>
          <SvgIcon name="shield-check" />
        </template>
        天翼认证登录
      </t-button>

      <t-button
        variant="outline"
        size="large"
        :disabled="loginStatus"
        style="width: 90%; gap: 8px; background-color: #fff"
        @click="router.push({ path: '/auth/login', query: route.query })"
      >
        <template #icon>
          <SvgIcon name="user" color="#0052d9" />
        </template>
        账号密码登录
      </t-button>

      <!-- <t-button
        variant="outline"
        size="large"
        :disabled="loginStatus"
        style="width: 90%; gap: 8px; background-color: #fff"
        @click="router.push('/auth/register')"
      >
        <template #icon>
          <SvgIcon name="user-plus" color="#0052d9" />
        </template>
        注册新账号
      </t-button> -->

      <div class="footer-tip">
        登录即表示同意
        <span class="tip-link" @click="userAgreementRef?.open()">《用户协议》</span>
        和
        <span class="tip-link" @click="privacyPolicyRef?.open()">《隐私政策》</span>
      </div>
    </div>

    <!-- 协议弹窗 -->
    <UserAgreementDialog ref="userAgreementRef" />

    <!-- 隐私政策弹窗 -->
    <PrivacyPolicyDialog ref="privacyPolicyRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { fetchTelecomLoginUrlUsingGet, unifiedLoginUsingGet } from '@/api/auth-controller'
import { useUserStore } from '@/stores/user-store'
import { getUrlQueryParamsUtil } from '@/utils'
import SvgIcon from '@/components/SvgIcon.vue'
import UserAgreementDialog from './components/UserAgreementDialog.vue'
import PrivacyPolicyDialog from './components/PrivacyPolicyDialog.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const systemTitle = import.meta.env.VITE_APP_TITLE
const systemDescription = import.meta.env.VITE_APP_DESCRIPTION
const systemSlogan = import.meta.env.VITE_APP_SLOGAN

const userAgreementRef = ref<InstanceType<typeof UserAgreementDialog>>()
const privacyPolicyRef = ref<InstanceType<typeof PrivacyPolicyDialog>>()

// 获取统一登录所需的 code，如果没有 code 则不执行统一登陆
const unifiedLoginCode = computed(() => getUrlQueryParamsUtil().code)

// 登陆时的加载和禁用状态，防止重复点击或跳转到其他页面引起冲突
const loginStatus = ref<boolean>(false)

/** 电信工作助手统一登陆 */
const handleUnifiedLogin = async () => {
  if (!unifiedLoginCode.value) {
    return
  }

  loginStatus.value = true

  try {
    const res = await unifiedLoginUsingGet({ code: unifiedLoginCode.value })
    if (res.data.data && res.data.code === 0) {
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
  } catch (error) {
    console.error(error)
  } finally {
    loginStatus.value = false
  }
}

/** 执行天翼认证登陆 */
const getTelecomLoginUrl = async () => {
  loginStatus.value = true

  try {
    const res = await fetchTelecomLoginUrlUsingGet()
    if (res.data.code === 0 && res.data.data) {
      window.location.href = res.data.data
    } else {
      Message.error({
        content: '获取天翼登录认证地址失败，' + res.data.msg,
        offset: [10, 16],
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loginStatus.value = false
  }
}

watchEffect(() => {
  handleUnifiedLogin()
})
</script>

<style scoped lang="scss">
#auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14vh 32px;
  gap: 16px;
  background: url('@/assets/svgs/bg/portal.svg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: 10% center;

  .system-logo {
    background-color: #0052d9;
    box-shadow: 0 6px 16px rgba(21, 93, 251, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 24px;
    padding: 8px;
  }

  .system-title {
    font-size: 24px;
    font-weight: 700;
    color: #001442;
  }

  .system-desc {
    font-size: 14px;
    color: #86909c;
  }

  .system-slogan {
    background-color: #e8f0fc;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #0052d9;
    border-radius: 20px;
    gap: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 12px;

    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;

    .footer-tip {
      font-size: 12px;
      color: #86909c;

      .tip-link {
        color: #0052d9;
      }
    }
  }
}
</style>
