<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-20 00:53
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-20 10:51
 * @FilePath     : \attendance-frontend-mobile\src\components\IconContainer.vue
 * @Description  :
-->
<template>
  <div class="icon-container" :style="containerStyle">
    <SvgIcon :name="icon" :color="iconColor" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

// 定义主题类型
type ThemeType = 'blue' | 'red' | 'orange' | 'green' | 'purple' | 'gray'

// 使用interface定义Props
interface Props {
  // 图标名称（必传）
  icon: string
  // 主题配置
  theme?: ThemeType
  // 是否启用阴影
  shadow?: boolean
}

// 定义默认值
const props = withDefaults(defineProps<Props>(), {
  size: '24px',
  theme: 'gray',
  shadow: false
})

// 主题颜色配置
const themeColors: Record<ThemeType, { icon: string; bg: string }> = {
  blue: { icon: '#0052D9', bg: '#E8F0FC' },
  red: { icon: '#D54941', bg: '#FDECEA' },
  orange: { icon: '#E37318', bg: '#FEF3E8' },
  green: { icon: '#2BA471', bg: '#E6F8F1' },
  purple: { icon: '#8B5CF6', bg: '#F3EFFE' },
  gray: { icon: '#666666', bg: '#F5F5F5' }
}

// 计算图标颜色
const iconColor = computed(() => {
  return themeColors[props.theme || 'gray'].icon
})

// 计算背景颜色
const bgColor = computed(() => {
  return themeColors[props.theme || 'gray'].bg
})

// 计算容器样式
const containerStyle = computed(() => {
  return {
    backgroundColor: bgColor.value,
    boxShadow: props.shadow ? '0px 1px 4px 0px rgba(0, 0, 0, 0.1)' : 'none'
  }
})
</script>

<style scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  padding: 3px;
  font-size: 24px;
}
</style>
