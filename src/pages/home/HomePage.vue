<template>
  <div id="home-page">
    <div class="user-info-bar">
      <img
        :src="loginUserInfo.avatar || '@/assets/images/avatar.png'"
        class="user-avatar"
        alt="avatar"
      />

      <div class="user-desc">
        <div class="user-name">{{ loginUserInfo.username }}</div>
        <div class="user-role">
          <SvgIcon name="map-pin" size="12px" style="margin-right: 4px" />
          <span>{{ loginUserInfo.dept?.name }}</span>
          <!-- <span>·</span>
          <span>研发工程师</span> -->
        </div>
      </div>

      <div class="system-rule">考勤规则</div>
    </div>

    <div class="attendance-container">
      <div class="attendance-calendar">
        <t-calendar :use-popup="false" switch-mode="year-month" title=" " />
      </div>

      <div class="attendance-info">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo
</script>

<style lang="scss" scoped>
#home-page {
  background-color: #f6f6f6;
  height: 120%;
}

.user-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px 20px 96px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  background-image: linear-gradient(to right bottom, #0052D9 0%, rgb(25, 60, 184) 100%);

  .user-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid #5885ff;
  }

  .user-desc {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .user-name {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }

    .user-role {
      font-size: 12px;
      color: #f3f3f3;
    }
  }

  .system-rule {
    padding: 6px 12px;
    text-align: center;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 12px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.attendance-container {
  position: absolute;
  padding: 16px 16px 96px;
  z-index: 10;
  top: 100px;
  width: 100vw;
  box-sizing: border-box;
}

:deep(.t-calendar) {
  border-radius: 24px;
  z-index: 10;
}

.attendance-info {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 16px 16px 96px;
  margin-top: 16px;
  border-radius: 16px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
}
</style>
