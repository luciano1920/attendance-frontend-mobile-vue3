<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/SmsCountDownButton.vue
 * @Description  : 倒计时按钮组件（用于触发验证码获取场景）
-->
<template>
  <t-button
    class="sms-countdown-button"
    size="extra-small"
    theme="primary"
    variant="text"
    :disabled="isCounting"
    @click="handleSmsSend"
  >
    {{ isCounting ? `${countdown}s 后重发` : initText }}
  </t-button>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Props {
  // 倒计时时间，单位：s
  duration?: number
  // 按钮初始文本
  initText?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 60,
  initText: '发送验证码',
})

const emit = defineEmits<{
  (e: 'send'): void
}>()

// 倒计时显示的时长数字
const countdown = ref(0)
// 是否正在倒计时
const isCounting = computed(() => countdown.value > 0)

// 定时器
let timer: ReturnType<typeof setInterval> | null = null

/** 处理按钮点击事件 */
const handleSmsSend = () => {
  // 如果正在倒计时，则不处理
  if (!isCounting.value) {
    emit('send')
  }
}

/** 清楚定时器 */
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/** 开始倒计时 */
const beginCountdown = () => {
  if (isCounting.value) {
    return
  }

  countdown.value = props.duration

  // 时间间隔为 1000 毫秒，即 1 秒
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearTimer()
    }
  }, 1000)
}

/** 结束倒计时 */
const stopCountdown = () => {
  clearTimer()
  countdown.value = 0
}

onUnmounted(() => {
  clearTimer()
})

defineExpose({
  beginCountdown,
  stopCountdown,
})
</script>

<style scoped lang="scss">
.sms-countdown-button {
  min-width: 100px;
  font-weight: 500;
}
</style>
