<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-31 11:03
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-19 12:09
 * @FilePath     : \attendance-frontend-mobile\src\layouts\AuthLayout.vue
 * @Description  : 认证页通用布局
-->
<template>
  <div id="auth-layout">
    <RouterView v-slot="{ Component }">
      <Transition name="auth-content-animation-unset" mode="out-in" appear>
        <component :is="Component" :key="$route.fullPath" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
/* 内容区域淡入淡出动画 */
/*
 * Vue Transition 动画类说明：
 * .auth-content-animation-enter-active: 新内容进入时的动画
 * .auth-content-animation-leave-active: 旧内容离开时的动画
 * .auth-content-animation-enter-from: 新内容的初始状态（从哪里开始）
 * .auth-content-animation-leave-to: 旧内容的结束状态（离开到哪里）
 * .auth-content-animation-enter-to: 新内容的结束状态（到达哪里）
 * .auth-content-animation-leave-from: 旧内容的初始状态
 */
/*
 * transition 属性：
 * opacity: 透明度变化，过渡时间 0.5秒
 * transform: 位置变化，过渡时间 0.5秒
 * ease: 缓动函数，让动画开始和结束时较慢，中间较快
 */

/* 定义进入和离开动画的过渡效果 */
.auth-content-animation-enter-active {
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.auth-content-animation-leave-active {
  transition:
    opacity 0.4s ease-in,
    transform 0.4s ease-in;
}

/* 新内容进入前的初始状态：从s上方 30px 处开始，透明度为 0（完全透明） */
.auth-content-animation-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* 旧内容离开后的最终状态：向下方移动 30px 后消失，透明度为 0 */
.auth-content-animation-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 新内容进入后的最终状态：到达正常位置，透明度为 1 */
/* 旧内容离开前的初始状态：在正常位置，透明度为 1 */
.auth-content-animation-enter-to,
.auth-content-animation-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
