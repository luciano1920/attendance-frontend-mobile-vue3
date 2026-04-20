<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 10:50
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-20 10:49
 * @FilePath     : \attendance-frontend-mobile\src\layouts\MobileLayout.vue
 * @Description  : 移动端页面布局
-->
<template>
  <div id="mobile-layout">
    <div class="main-container">
      <!-- TODO：这里在 name 后面加上 unset 作为临时隐藏动画，后续开启可以去掉 unset -->
      <RouterView v-slot="{ Component }">
        <Transition name="mobile-content-animation-unset" mode="out-in" appear>
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </div>

    <div class="nav-container">
      <t-tab-bar
        class="navigation-menu"
        v-model="activeTab"
        shape="round"
        theme="tag"
        :split="false"
        @change="navigateOnMenuClick"
      >
        <t-tab-bar-item v-for="item in tabMenuList" :key="item.value" :value="item.value">
          {{ item.label }}
          <template #icon>
            <SvgIcon :name="item.icon" size="20px" />
          </template>
        </t-tab-bar-item>
      </t-tab-bar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const route = useRoute()

//  当前活动标签的响应式状态，默认值为根路径 '/'
const activeTab = ref('/')
// 导航菜单列表配置
const tabMenuList = [
  { value: '/', label: '打卡', icon: 'calendar-check' },
  { value: '/apply', label: '申请', icon: 'file-text' },
  { value: '/approve', label: '审批', icon: 'shield-check' },
  { value: '/profile', label: '我的', icon: 'user-circle' }
]

/**
 * 根据菜单点击进行导航跳转的函数
 * @param value - 目标路由的路径字符串
 */
const navigateOnMenuClick = (value: string) => {
  router.push({ path: value })
}

/**
 * 路由导航后钩子函数，在每次路由跳转后执行
 * @param to - 即将要进入的目标路由对象
 * @param from - 当前导航正要离开的路由对象
 */
router.afterEach((to, from) => {
  // 设置当前激活的标签页为目标路由的路径
  activeTab.value = to.path
})

// 组件挂载时初始化当前选中项
onMounted(() => {
  activeTab.value = route.path
})
</script>

<style lang="scss" scoped>
:deep(.navigation-menu) {
  --td-tab-bar-height: 54px;
  --td-brand-color-light: #0052d9;
  --td-tab-bar-active-color: #fff;

  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #e5e8eb;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  margin-bottom: 16px;
  // padding: 0 6px;
  // border-radius: 22px;
  z-index: 999 !important;

  .t-tab-bar-item {
    padding: 0 5px;
    margin: 4px 0;
    background: transparent;
  }

  .t-tab-bar-item__content {
    // border-radius: 16px !important;
    // transition: all 0.2s ease;

    &--checked {
      transform: scale(1.05);
    }

    .t-tab-bar-item__text {
      font-size: 10px;
    }
  }
}

/* 内容区域淡入淡出动画 */
/*
 * Vue Transition 动画类说明：
 * .mobile-content-animation-enter-active: 新内容进入时的动画
 * .mobile-content-animation-leave-active: 旧内容离开时的动画
 * .mobile-content-animation-enter-from: 新内容的初始状态（从哪里开始）
 * .mobile-content-animation-leave-to: 旧内容的结束状态（离开到哪里）
 * .mobile-content-animation-enter-to: 新内容的结束状态（到达哪里）
 * .mobile-content-animation-leave-from: 旧内容的初始状态
 */
/*
 * transition 属性：
 * opacity: 透明度变化，过渡时间 0.5秒
 * transform: 位置变化，过渡时间 0.5秒
 * ease: 缓动函数，让动画开始和结束时较慢，中间较快
 */

/* 定义进入和离开动画的过渡效果 */
.mobile-content-animation-enter-active {
  transition:
    opacity 0.4s ease-out,
    transform 0.4s ease-out;
}

.mobile-content-animation-leave-active {
  transition:
    opacity 0.4s ease-in,
    transform 0.4s ease-in;
}

/* 新内容进入前的初始状态：从s上方 30px 处开始，透明度为 0（完全透明） */
.mobile-content-animation-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* 旧内容离开后的最终状态：向下方移动 30px 后消失，透明度为 0 */
.mobile-content-animation-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 新内容进入后的最终状态：到达正常位置，透明度为 1 */
/* 旧内容离开前的初始状态：在正常位置，透明度为 1 */
.mobile-content-animation-enter-to,
.mobile-content-animation-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
