<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/TelecomLoginPage.vue
 * @Description  : 天翼认证登录中间页（处理天翼认证回调参数）
-->
<template>
  <div id="telecom-login-page">
    <!-- 加载状态 -->
    <t-loading
      v-if="loading"
      :loading="loading"
      layout="vertical"
      size="26px"
      text="登录验证中，请稍候..."
      fullscreen
    />

    <!-- 错误状态 -->
    <div v-else-if="errorTitle">
      <t-result theme="warning" :title="errorTitle" :description="errorDesc" />
      <!-- 返回操作 -->
      <div class="back-action">
        <t-button theme="light" @click="router.push('/auth/portal')">返回登录</t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'tdesign-mobile-vue'

import { telecomLoginUsingGet } from '@/api/auth-controller'
import { useUserStore } from '@/stores/user-store'

const router = useRouter()
const userStore = useUserStore()

const loading = ref<boolean>(true)
const errorTitle = ref<string>('')
const errorDesc = ref<string>('Unauthorized')

/**
 * 执行天翼认证登录
 * @param params { appId: string; paras: string; sign: string } 天翼认证回调参数
 */
const handleTelecomLogin = async (params: { appId: string; paras: string; sign: string }) => {
  try {
    const res = await telecomLoginUsingGet({
      appId: params.appId,
      paras: params.paras,
      sign: params.sign,
    })

    if (res.data.code === 0 && res.data.data) {
      userStore.setLoginUserInfo({
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
        expiresTime: res.data.data.expiresTime,
      })
      userStore.fetchLoginUserInfo()

      // 防止用户登录成功后，点击手机的“返回”键又回到这个中间页导致报错或死循环。
      const redirect = router.currentRoute.value.query.redirect as string
      router.replace({
        path: redirect || '/',
      })
    } else {
      Message.error({
        content: '天翼认证登录失败',
        offset: [10, 16],
      })
      errorTitle.value = '天翼认证登录失败'
      errorDesc.value = res.data.msg || 'Unauthorized'
    }
  } catch (error) {
    console.error('天翼认证登录异常:', error)
    errorTitle.value = '网络异常，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const queryString = location.search.split('?')[1]
  const urlParams = new URLSearchParams(queryString)
  const appId = urlParams.get('appId') || ''
  const paras = urlParams.get('paras') || ''
  const sign = urlParams.get('sign') || ''

  // 基础防错：如果被人直接访问这个空页面，给个提示
  if (!appId || !paras || !sign) {
    errorTitle.value = '缺少认证参数，非法访问'
    loading.value = false
    return
  }

  console.log('天翼认证登录参数:', appId, paras, sign)

  handleTelecomLogin({ appId, paras, sign })
})
</script>

<style scoped lang="scss">
#telecom-login-page {
  display: flex;
  align-items: center;
  // justify-content: center;
  height: 100vh;
  width: 100vw;

  .back-action {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

:deep(.t-loading__text) {
  margin-top: 24px !important;
  font-size: 18px !important;
  font-weight: 500;
  color: #0052d9;
}
</style>
