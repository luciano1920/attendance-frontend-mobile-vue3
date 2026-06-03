<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/pages/system/UserSettingsPage.vue
 * @Description  : 用户应用设置页
-->
<template>
  <div id="user-settings-page">
    <div class="nav-bar" @click="router.push('/profile')">
      <AppSvgIcon name="chevron-left" size="22px" />
      应用设置
    </div>

    <!-- 账号与安全设置 -->
    <t-cell-group title="账号与安全" theme="card">
      <t-cell title="已绑定手机号" hover :note="loginUserInfo.mobile" />
      <t-cell title="修改密码" arrow hover @click="router.push('/update-password')" />
    </t-cell-group>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import AppSvgIcon from '@/components/AppSvgIcon.vue'

const router = useRouter()
const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo
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
</style>
