<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/BackListTop.vue
 * @Description  : 列表一键返回顶部按钮
-->
<template>
  <div
    v-show="visible"
    :class="['back-list-top', `back-list-top--${theme}`, { 'back-list-top--fixed': fixed }]"
    @click="handleClick"
  >
    <span class="back-list-top-icon">
      <SvgIcon name="arrow-up-to-line" size="20px" />
    </span>

    <span v-if="text" class="back-list-top-text">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  /** 是否绝对定位固定到屏幕右下方，默认 true */
  fixed?: boolean
  /** 文案 */
  text?: string
  /** 滚动高度达到此值才出现，默认 200 */
  visibilityHeight?: number
  /** 预设样式类型，目前只支持 round */
  theme?: 'round'
}

const props = withDefaults(defineProps<Props>(), {
  fixed: true,
  text: '',
  visibilityHeight: 200,
  theme: 'round',
})

const emit = defineEmits<{
  (e: 'to-top'): void
}>()

// 显隐控制
const visible = ref(false)

const updateVisible = () => {
  const scrollTop = window.scrollY ?? document.documentElement.scrollTop
  visible.value = scrollTop >= props.visibilityHeight
}

onMounted(() => {
  window.addEventListener('scroll', updateVisible, { passive: true })
  updateVisible()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisible)
})

/** 回顶点击事件 */
const handleClick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  emit('to-top')
}
</script>

<style lang="scss" scoped>
.back-list-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border-radius: 50%;
  background-color: #fff;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  padding: 2px;

  transition:
    opacity 0.2s,
    transform 0.2s;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  &:active {
    transform: scale(0.92);
  }

  &--fixed {
    position: fixed;
    right: 16px;
    bottom: 90px;
    z-index: 999;
  }

  &--round {
    min-width: 48px;
    min-height: 48px;
    border-radius: 50%;
  }

  .back-list-top-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .back-list-top-text {
    font-size: 12px;
    line-height: 1;
  }
}
</style>
