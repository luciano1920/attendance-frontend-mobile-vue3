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

      <t-button size="small" variant="outline" class="system-rule">
        <SvgIcon name="file-text" />
        考勤规则
      </t-button>
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
  padding: 16px 16px 96px;
}

.user-info-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #c4c6cd;
    padding: 1px;
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
      color: #171a1d;
    }

    .user-role {
      font-size: 13px;
      color: #86909c;
    }
  }

  .system-rule {
    color: #0052d9;
    background-color: #fff;
    --td-button-border-radius: 12px;
    font-weight: 500;
  }
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
