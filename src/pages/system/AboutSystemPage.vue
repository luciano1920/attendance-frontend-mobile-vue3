<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/AboutSystemPage.vue
 * @Description  : 关于系统页面
-->
<template>
  <div id="about-system-page">
    <div class="nav-bar" @click="router.push('/profile')">
      <AppSvgIcon name="chevron-left" size="22px" />
      关于应用
    </div>

    <div class="app-header">
      <div class="app-logo">
        <AppSvgIcon name="fingerprint-pattern" color="#fff" size="44px" />
      </div>
      <div class="app-name">{{ systemTitle }}</div>
      <div class="app-version">Version {{ systemVersion }}</div>
    </div>

    <t-cell-group title="协议与规范" theme="card">
      <t-cell title="用户协议" arrow hover @click="userAgreementRef?.open()" />
      <t-cell title="隐私政策" arrow hover @click="privacyPolicyRef?.open()" />
    </t-cell-group>

    <t-cell-group title="其他信息" theme="card">
      <t-cell title="技术支持" hover note="数智产品研发中心" />
      <t-cell title="检查更新" hover note="已是最新版本" />
    </t-cell-group>

    <div class="footer-copyright">
      <t-footer :text="`Copyright © 2025-${new Date().getFullYear()} 数智产品研发中心.`" />
      <t-footer text="All Rights Reserved" />
    </div>

    <UserAgreementDialog ref="userAgreementRef" />
    <PrivacyPolicyDialog ref="privacyPolicyRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSvgIcon from '@/components/AppSvgIcon.vue'
import UserAgreementDialog from '@/pages/auth/components/UserAgreementDialog.vue'
import PrivacyPolicyDialog from '@/pages/auth/components/PrivacyPolicyDialog.vue'

const router = useRouter()

// 获取系统环境变量
const systemTitle = import.meta.env.VITE_APP_TITLE
const systemVersion = import.meta.env.VITE_APP_SYSTEM_VERSION

// 弹窗组件引用
const userAgreementRef = ref<InstanceType<typeof UserAgreementDialog>>()
const privacyPolicyRef = ref<InstanceType<typeof PrivacyPolicyDialog>>()
</script>

<style scoped lang="scss">
.nav-bar {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  gap: 8px;
}

.app-header {
  box-sizing: border-box;
  height: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  background: url('../../assets/svgs/bg/system.svg');
  background-repeat: no-repeat;
  background-size: 100% auto;
  // background-position: center;
  margin: 16px;
  border: 1px solid #e7e8eb;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);

  .app-logo {
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

  .app-name {
    font-size: 20px;
    font-weight: 600;
    color: #001442;
  }

  .app-version {
    font-size: 14px;
    color: #86909c;
    padding: 4px 12px;
    border-radius: 12px;
  }
}

.footer-copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
}
</style>
