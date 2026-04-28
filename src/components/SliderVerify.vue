<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-28 15:13
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-28 16:27
 * @FilePath     : \attendance-frontend-mobile\src\components\SliderVerify.vue
 * @Description  : 滑动验证弹窗组件（采用 vue3-slide-verify 库进行封装）
-->
<template>
  <t-dialog
    v-model:visible="visible"
    close-btn
    :cancel-btn="null"
    :confirm-btn="null"
    title="人机验证"
  >
    <template #content>
      <VueSlideVerify
        ref="slideVerifyRef"
        :w="260"
        slider-text="向右滑动验证"
        :accuracy="5"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
      />
      <div>{{ msg }}</div>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import VueSlideVerify, { type SlideVerifyInstance } from 'vue3-slide-verify'
import 'vue3-slide-verify/dist/style.css'
import { Message } from 'tdesign-mobile-vue'

import { checkImageCaptchaUsingGet, fetchImageCaptchaUsingGet } from '@/api/auth-controller'
import { useDeviceId } from '@/composables/useDeviceId'
import { aesEncrypt } from '@/libs/cryptojs/aes'

const { deviceId } = useDeviceId() // 获取设备 UUID

const visible = ref<boolean>(false)
const slideVerifyRef = ref<SlideVerifyInstance>()

interface Props {
  // 验证成功回调
  verify?: (captchaVerification?: string | null) => void
}
const props = defineProps<Props>()

const msg = ref('')

// 后端返回的验证所需信息
const authInfo = reactive({
  token: null,
  secretKey: null,
})

/** 获取图形滑动验证所需的验证信息 */
const getVerificationInfo = async () => {
  const res = await fetchImageCaptchaUsingGet({
    captchaType: 'blockPuzzle',
    clientUid: deviceId.value,
    ts: Date.now(), // 现在的时间戳
  })
  if (res.data.repData && res.data.repCode === '0000') {
    authInfo.token = res.data.repData.token
    authInfo.secretKey = res.data.repData.secretKey
  } else {
    Message.error({ content: res.data.repMsg, offset: [10, 16] })
  }
}

/**
 * 验证成功回调
 * @param detail 验证成功信息，包含验证耗时和滑动距离
 */
const onSuccess = async (detail: { timestamp: number; left: number }) => {
  msg.value = `耗时${(detail.timestamp / 1000).toFixed(1)}s, 移动距离${detail.left}px`
  // setTimeout(() => {
  //   props.verify?.()
  // }, 1000)

  if (!authInfo.token || !authInfo.secretKey) {
    Message.error({ content: '验证信息获取失败', offset: [10, 16] })

    return
  }

  const res = await checkImageCaptchaUsingGet({
    captchaType: 'blockPuzzle',
    pointJson: aesEncrypt(JSON.stringify({ x: detail.left, y: 5.0 }), authInfo.secretKey),
    token: authInfo.token,
  })
  if (res.data.repCode === '0000') {
    const captchaVerification = aesEncrypt(
      authInfo.token + '---' + JSON.stringify({ x: detail.left, y: 5.0 }),
      authInfo.secretKey,
    )
    Message.success({ content: '验证成功', offset: [10, 16] })
    setTimeout(() => {
      // 验证通过，将验证信息传递给父组件
      props.verify?.(captchaVerification)
    }, 1000)
  } else {
    Message.error({ content: res.data.repMsg, offset: [10, 16] })
    // 要重新获取图形验证码信息
    getVerificationInfo()
    setTimeout(() => {
      // 验证失败，刷新验证码
      slideVerifyRef.value?.refresh()
    }, 2000)
  }
}

/** 验证失败回调 */
const onFail = () => {
  msg.value = ''
}

/** 验证码刷新回调 */
const onRefresh = () => {
  msg.value = ''
}

/** 提供打开弹窗的方法 */
const open = () => {
  msg.value = ''
  visible.value = true
}

/** 提供关闭弹窗的方法 */
const close = () => {
  // 关闭弹窗时提前进行刷新，下一次打开弹窗时图形验证码加载更快
  slideVerifyRef.value?.refresh()
  visible.value = false
}

onMounted(() => {
  getVerificationInfo()
})

defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped></style>
