<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-29 16:15
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-30 23:10
 * @FilePath     : \attendance-frontend-mobile\src\pages\apply\ApplyPage.vue
 * @Description  : 考勤申请页面
-->
<template>
  <div id="apply-page">
    <t-navbar fixed title="考勤申请" placeholder />

    <!-- 考勤申请选项条目 -->
    <div class="apply-action">
      <div style="font-weight: 600; margin-bottom: 12px">常用申请</div>

      <div class="common-apply-card">
        <div v-for="(item, index) in commonApplyList" :key="index" class="common-card-item">
          <div class="common-card-item-icon" :style="{ backgroundColor: item.bgColor }">
            <SvgIcon :name="item.icon" :color="item.color" size="24px" />
          </div>
          <div class="common-card-item-name" :style="{ '--hover-color': item.color }">
            {{ item.name }}
          </div>
          <div class="common-card-item-desc">{{ item.description }}</div>
        </div>
      </div>

      <div style="font-weight: 600; margin: 12px 0">系统设置</div>

      <div class="face-apply-card">
        <div class="face-card-item" :style="{ '--face-hover-color': faceApplyConfig.color }">
          <div class="face-card-item-icon" :style="{ backgroundColor: faceApplyConfig.bgColor }">
            <SvgIcon :name="faceApplyConfig.icon" :color="faceApplyConfig.color" size="24px" />
          </div>
          <div>
            <div class="face-card-item-name">{{ faceApplyConfig.name }}</div>
            <div class="face-card-item-desc">{{ faceApplyConfig.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { getCommonApplyList, getFaceUpdateApplyConfig } from '@/constants/apply'

// 申请选项数据
const commonApplyList = getCommonApplyList()
const faceApplyConfig = getFaceUpdateApplyConfig()
</script>

<style scoped lang="scss">
.apply-action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  padding: 16px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

  .common-apply-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 16px;

    .common-card-item {
      width: 30vw;
      display: flex;
      flex-direction: column;
      background-color: #f8fafc;
      padding: 16px;
      border-radius: 16px;
      transition: all 0.3s ease;

      .common-card-item-icon {
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 14px;
        padding: 8px;
        margin-bottom: 12px;
      }

      .common-card-item-name {
        margin-bottom: 4px;
        color: #272b34;
        transition: all 0.3s ease;
      }

      .common-card-item-desc {
        font-size: 13px;
        color: #858a99;
      }

      &:hover {
        background-color: #f1f5f9;

        .common-card-item-name {
          color: var(--hover-color);
        }
      }
    }
  }

  .face-apply-card {
    display: flex;
    justify-content: center;
    align-items: center;

    .face-card-item {
      width: calc(60vw + 48px);
      display: flex;
      align-items: center;
      background-color: #f8fafc;
      padding: 16px;
      gap: 12px;
      border-radius: 16px;
      transition: all 0.3s ease;

      .face-card-item-icon {
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 14px;
        padding: 8px;
      }

      .face-card-item-name {
        margin-bottom: 4px;
        color: #272b34;
        transition: all 0.3s ease;
      }

      .face-card-item-desc {
        font-size: 13px;
        color: #858a99;
      }

      &:hover {
        background-color: #f1f5f9;

        .face-card-item-name {
          color: var(--face-hover-color);
        }
      }
    }
  }
}
</style>
