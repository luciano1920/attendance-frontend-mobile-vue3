<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/auth/UnauthorizedPage.vue
 * @Description  : 无权限页面
-->
<template>
  <div id="unauthorized-page">
    <t-result description="无权限访问该页面" theme="error" title="403 Forbidden" />
    <!-- 返回操作 -->
    <div class="back-action">
      <t-button theme="light" @click="$router.back()">返回</t-button>
      <t-button theme="primary" @click="$router.replace('/')">首页</t-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#unauthorized-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .back-action {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}
</style>
