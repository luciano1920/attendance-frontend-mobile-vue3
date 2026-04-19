<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 15:04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-25 09:32
 * @FilePath     : \attendance-frontend-mobile\src\components\SvgIcon.vue
 * @Description  : SVG 图标组件，用于动态加载和显示 SVG 图标
-->
<template>
  <svg
    :class="svgClass"
    :style="{ color: color, fontSize: typeof size === 'number' ? `${size}px` : size }"
    aria-hidden="true"
    v-bind="$attrs"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** `src\assets\svgs\icons` 目录下的图标名称，用于动态加载对应的SVG文件 */
  name: string
  /** 自定义类名 */
  className?: string
  /** 图标颜色 */
  color?: string
  /** 图标大小 */
  size?: string | number
}

const props = defineProps<Props>()

// 本地图标的 symbol id
const iconName = computed(() => `#icon-${props.name}`)

// 动态类名
const svgClass = computed(() => {
  const classes = ['svg-icon']
  if (props.className) classes.push(props.className)
  return classes.join(' ')
})
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
