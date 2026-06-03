<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/AppRadioButtonGroup.vue
 * @Description  : 单选框组按钮式组件
-->
<template>
  <div class="app-radio-button-group" :class="computedClass">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="radio-button"
      :class="{
        'radio-button--active': modelValue === option.value,
        'radio-button--disabled': option.disabled,
      }"
      @click="handleClick(option.value as RadioValue)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RadioOptionObj, RadioValue } from 'tdesign-mobile-vue'

// 主题色定义
const themeColors = {
  blue: '#0052d9',
  green: '#2ba471',
  red: '#d54941',
  orange: '#e37318',
  purple: '#8b5cf6',
} as const

type ThemeColor = keyof typeof themeColors

interface Props {
  options: RadioOptionObj[]
  modelValue: RadioValue
  theme?: ThemeColor
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'blue',
  size: 'medium',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioValue): void
  (e: 'change', value: RadioValue): void
}>()

const computedClass = computed(() => ({
  [`app-radio-button-group--${props.size}`]: true,
}))

/**
 * 处理单选按钮点击
 * @param value 单选按钮的值
 */
const handleClick = (value: RadioValue) => {
  if (!value) return

  // 检查当前点击的选项是否被禁用
  const clickedOption = props.options.find((opt) => opt.value === value)
  if (clickedOption?.disabled) return

  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.app-radio-button-group {
  display: inline-flex;
  gap: 6px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: transparent;
}

.radio-button {
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  border-radius: 8px;
  background-color: #f5f6f7;
  color: #4e5969;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  text-align: center;
  flex: 1;
  max-width: 120px;
}

.radio-button--active {
  background-color: v-bind('themeColors[props.theme]');
  color: #fff;
}

.radio-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

/* 大小调整 */
.app-radio-button-group--small {
  height: 24px;
}

.app-radio-button-group--small .radio-button {
  height: 24px;
  line-height: 24px;
  font-size: 11px;
  padding: 0 8px;
}

.app-radio-button-group--large {
  height: 36px;
}

.app-radio-button-group--large .radio-button {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  padding: 0 12px;
}

/* 主题色 */
:deep(.app-radio-button-group--blue .radio-button--active) {
  background-color: #0052d9;
}

:deep(.app-radio-button-group--green .radio-button--active) {
  background-color: #2ba471;
}

:deep(.app-radio-button-group--red .radio-button--active) {
  background-color: #d54941;
}

:deep(.app-radio-button-group--orange .radio-button--active) {
  background-color: #e37318;
}

:deep(.app-radio-button-group--purple .radio-button--active) {
  background-color: #8b5cf6;
}
</style>
