<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/components/AppDescriptionsItem.vue
 * @Description  : 详情描述项组件
-->
<template>
  <div class="app-descriptions-item" :class="[border ? 'is-bordered' : '']">
    <div class="app-descriptions-item-label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="app-descriptions-item-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  border: true,
})
</script>

<style scoped lang="scss">
.app-descriptions-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 6px 0;

  .app-descriptions-item-label {
    font-size: 14px;
    font-weight: 500;
    color: #86909c;
    flex-shrink: 0;
    margin-right: 8px;
  }

  .app-descriptions-item-content {
    font-size: 14px;
    font-weight: 500;
    color: #171a1d;
    text-align: right;
    word-break: break-all;
    min-width: 0;
  }
}

.is-bordered:not(:last-child) {
  border-bottom: 1px solid #f5f6f7;
}
</style>
