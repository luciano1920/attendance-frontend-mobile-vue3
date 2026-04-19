<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 22:02
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-04-19 10:35
 * @FilePath     : \attendance-frontend-mobile\src\pages\auth\AuthPortalPage.vue
 * @Description  : 系统认证登录门户页
-->
<template>
  <div id="auth-page">
    <div class="system-logo">
      <SvgIcon name="fingerprint-pattern" color="#fff" size="44px" />
    </div>

    <div class="system-title">{{ systemTitle }}</div>
    <div class="system-desc">{{ systemDescription }}</div>

    <div class="auth-action">
      <div class="login-action" @click="router.push('/auth/login')">
        <div class="login-avatar-wrapper">
          <img src="../../assets/images/avatar.png" class="user-avatar" alt="avatar" />
          <SvgIcon name="user-circle" color="#2b7fff" class="avatar-badge" />
        </div>

        <div class="login-user-desc">
          <div class="login-user-name">账号密码登录</div>
          <div class="login-user-role">
            <span>数智产品研发中心</span>
            <span>·</span>
            <span>罗钧</span>
          </div>
        </div>

        <t-button theme="light" shape="round" size="small" class="login-button">登录</t-button>
      </div>

      <div class="login-action" @click="router.push('/tianyiBox')">
        <div class="login-avatar-wrapper">
          <img src="../../assets/images/telecom.png" class="user-avatar" alt="avatar" />
          <SvgIcon name="shield-check" color="#00bc7d" class="avatar-badge" />
        </div>

        <div class="login-user-desc">
          <div class="login-user-name">天翼认证登录</div>
          <div class="login-user-role">
            <span>数智产品研发中心</span>
            <span>·</span>
            <span>罗钧</span>
          </div>
        </div>

        <t-button theme="light" shape="round" size="small" class="login-button">登录</t-button>
      </div>

      <div class="register-action" @click="router.push('/auth/register')">
        <SvgIcon name="plus-circle" />
        <div>注册新账号</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { unifiedLoginUsingGet } from '@/api/auth-controller'
import { fetchApproverInfoUsingGet } from '@/api/user-controller'
import { useUserStore } from '@/stores/user-store'
import { getUrlQueryParamsUtil } from '@/utils'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const systemTitle = import.meta.env.VITE_APP_TITLE
const systemDescription = import.meta.env.VITE_APP_DESCRIPTION

// 获取统一登录所需的 code，如果没有 code 则不执行统一登陆
const unifiedLoginCode = computed(() => getUrlQueryParamsUtil().code)

/** 电信工作助手统一登陆 */
const handleUnifiedLogin = async () => {
  if (!unifiedLoginCode.value) {
    return
  }

  const res_login = await unifiedLoginUsingGet({ code: unifiedLoginCode.value })
  if (res_login.data.data && res_login.data.code === 0) {
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

watchEffect(() => {
  handleUnifiedLogin()
})
</script>

<style scoped lang="scss">
#auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 32px;
  height: 70vh;

  .system-logo {
    background-color: #0052D9;
    box-shadow: 0 6px 16px rgba(21, 93, 251, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border-radius: 20px;
    padding: 8px;
  }

  .system-title {
    font-size: 24px;
    font-weight: 700;
    color: #001442;
    margin-top: 24px;
    margin-bottom: 8px;
  }

  .system-desc {
    font-size: 14px;
    color: #62748e;
    margin-bottom: 48px;
  }

  .auth-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 16px;

    .login-action {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 12px 16px;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f1f5f9;
      }

      &:active {
        transform: scale(0.98);
      }

      .login-avatar-wrapper {
        position: relative;
        display: inline-block;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
          padding: 2px;
        }

        .avatar-badge {
          position: absolute;
          bottom: 4px;
          right: -2px;
          width: 16px;
          height: 16px;
          background-color: #fff;
          border-radius: 50%;
          padding: 1px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }

      .login-user-desc {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;

        .login-user-name {
          font-size: 16px;
          font-weight: 600;
          color: rgb(15, 23, 43);
        }

        .login-user-role {
          font-size: 13px;
          color: rgb(98, 116, 142);
        }
      }
    }

    .register-action {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background-color: rgb(255, 255, 255);
      border: 1px dashed rgb(202, 213, 226);
      border-radius: 16px;
      padding: 16px;
      color: rgb(69, 85, 108);
      transition: all 0.2s ease;

      &:hover {
        background-color: rgb(239, 246, 255);
        border-color: rgb(81, 162, 255);
        color: #0052D9;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}

:deep(.t-button--round) {
  background-color: rgb(239, 246, 255);
  font-weight: 400;
  font-size: 15px;
  font-family: normal;

  &:hover {
    background-color: rgb(219, 234, 254);
  }
}
</style>
