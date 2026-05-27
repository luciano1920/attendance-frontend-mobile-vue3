<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/pages/apply/ApplyPage.vue
 * @Description  : 考勤申请入口页面
-->
<template>
  <div id="apply-page">
    <t-navbar fixed title="考勤申请" placeholder />

    <!-- 考勤申请选项条目 -->
    <div class="apply-action">
      <div class="apply-action-title">选择申请类型</div>

      <div class="apply-action-grid">
        <div class="apply-action-item short-item" @click="$router.push('/apply/leave')">
          <IconContainer icon="coffee" theme="blue" />
          <div class="apply-action-item-label">
            <div class="apply-action-item-name">请假申请</div>
            <div class="apply-action-item-desc">事假/病假</div>
          </div>
        </div>

        <div class="apply-action-item short-item" @click="$router.push('/apply/outing')">
          <IconContainer icon="plane" theme="orange" />
          <div class="apply-action-item-label">
            <div class="apply-action-item-name">外出申请</div>
            <div class="apply-action-item-desc">公差/出差/驻点</div>
          </div>
        </div>

        <div class="apply-action-item short-item" @click="$router.push('/apply/makeup')">
          <IconContainer icon="calendar-plus" theme="red" />
          <div class="apply-action-item-label">
            <div class="apply-action-item-name">补卡申请</div>
            <div class="apply-action-item-desc">忘记打卡/设备故障</div>
          </div>
        </div>

        <div class="apply-action-item short-item" @click="$router.push('/apply/rest')">
          <IconContainer icon="moon" theme="green" />
          <div class="apply-action-item-label">
            <div class="apply-action-item-name">调休申请</div>
            <div class="apply-action-item-desc">申请调休休假</div>
          </div>
        </div>

        <div class="apply-action-item long-item" @click="$router.push('/apply/face-update')">
          <IconContainer icon="scan-face" theme="purple" />
          <div class="apply-action-item-label">
            <div class="apply-action-item-name">人脸录入</div>
            <div class="apply-action-item-desc">录入人脸用于人脸识别打卡</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconContainer from '@/components/IconContainer.vue'
</script>

<style scoped lang="scss">
.apply-action {
  padding: 16px;

  .apply-action-title {
    font-size: 14px;
    color: #86909c;
    margin-bottom: 8px;
    margin-left: 4px;
  }

  .apply-action-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 12px;
    align-items: flex-start;
    align-content: flex-start;
    position: relative;

    .apply-action-item {
      box-sizing: border-box;
      position: relative;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      border-radius: 16px 16px 16px 16px;
      background-color: rgba(255, 255, 255, 1);
      padding: 16px;
      gap: 8px;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
      }

      .apply-action-item-label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 2px;

        .apply-action-item-name {
          font-size: 16px;
          font-weight: 600;
          color: #171a1d;
        }

        .apply-action-item-desc {
          font-size: 13px;
          color: #86909c;
        }
      }
    }

    .short-item {
      width: calc((100% - 12px) / 2);
      height: 132px;
    }

    .long-item {
      width: 100%;
      height: 80px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
    }
  }
}
</style>
