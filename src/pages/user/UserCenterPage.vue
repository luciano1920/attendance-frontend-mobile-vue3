<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-03-29 11:07
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-26 13:50
 * @FilePath     : \attendance-frontend-mobile\src\pages\user\UserCenterPage.vue
 * @Description  : 用户中心（我的）页面
-->
<template>
  <div id="user-center-page">
    <!-- 用户简介区域 -->
    <div class="user-profile">
      <div class="user-profile-info">
        <img
          :src="loginUserInfo.avatar || '@/assets/images/avatar.png'"
          class="user-avatar"
          alt="avatar"
        />
        <div class="user-name">{{ loginUserInfo.username }}</div>
        <div class="user-role">
          <span>{{ loginUserInfo.dept?.name }}</span>
          <!-- <span>·</span>
            <span>研发工程师</span> -->
        </div>
      </div>
    </div>

    <!-- 用户操作区域 -->
    <div class="user-action">
      <div class="user-attendance-statistics">
        <div v-for="(item, index) in statisticsData" :key="index" class="statistics-item">
          <div class="item-value" :style="{ color: item.color }">{{ item.value }}</div>
          <div class="item-desc">{{ item.desc }}</div>
        </div>
      </div>

      <t-cell-group theme="card" class="user-action-list">
        <t-cell title="消息中心" arrow hover>
          <template #leftIcon>
            <IconContainer icon="bell" theme="orange" />
          </template>
        </t-cell>
        <t-cell title="应用设置" arrow hover>
          <template #leftIcon>
            <IconContainer icon="settings" theme="blue" />
          </template>
        </t-cell>
        <t-cell title="帮助中心" arrow hover>
          <template #leftIcon>
            <IconContainer icon="question-mark-circle" theme="green" />
          </template>
        </t-cell>
        <t-cell title="关于系统" arrow hover>
          <template #leftIcon>
            <IconContainer icon="info" theme="purple" />
          </template>
        </t-cell>
      </t-cell-group>

      <t-button
        size="large"
        class="user-logout"
        theme="danger"
        variant="outline"
        @click="handleLogout"
      >
        <SvgIcon name="log-out" />
        退出登录
      </t-button>

      <t-footer :text="`Copyright © 2026-${new Date().getFullYear()} 数智产品研发中心.`" />
      <t-footer :text="systemTitle + ' ' + systemVersion" />
      <!-- <div class="system-version">{{ systemTitle }} {{ systemVersion }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logoutUsingPost } from '@/api/auth-controller'
import { ActionSheetPlugin, Message } from 'tdesign-mobile-vue'
import { useUserStore } from '@/stores/user-store'
import SvgIcon from '@/components/SvgIcon.vue'
import IconContainer from '@/components/IconContainer.vue'

const router = useRouter()
const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

const systemTitle = import.meta.env.VITE_APP_TITLE
const systemVersion = import.meta.env.VITE_APP_SYSTEM_VERSION

// 统计数据
const statisticsData = [
  { value: 10, desc: '本月打卡', color: '#2ba471' },
  { value: 8, desc: '补卡', color: '#e37318' },
  { value: 5, desc: '无需打卡', color: '#0052d9' },
  { value: 2, desc: '缺卡', color: '#d54941' },
]

/** 退出登录 */
const handleLogout = async () => {
  ActionSheetPlugin.show({
    items: [{ label: '确认退出', color: '#d54941' }],
    cancelText: '取消',
    description: '确定要退出登录吗？',
    // 取消按钮事件
    onCancel: () => {
      ActionSheetPlugin.close()
    },
    // 选择项点击事件
    onSelected: async (selected: any, selectedIndex: number) => {
      if (selected.label === '确认退出') {
        try {
          const res = await logoutUsingPost()
          if (res.data.code === 0) {
            userStore.resetUserState()
            Message.success('退出登录成功')
            router.replace('/auth')
          } else {
            Message.error('退出登录失败，' + res.data.msg)
          }
        } catch (error) {
          Message.error('退出登录失败，请稍后重试')
          console.error('退出登录错误:', error)
        } finally {
          ActionSheetPlugin.close()
        }
      }
    },
  })
}
</script>

<style lang="scss" scoped>
#user-center-page {
  height: 112vh;
  overflow: auto;
}

.user-profile {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: url('@/assets/svgs/bg/profile.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;

  .user-profile-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .user-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
      padding: 1px;
    }

    .user-name {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }

    .user-role {
      font-size: 14px;
      color: #fff;
      font-weight: 400;
    }
  }
}

.user-action {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;

  .user-attendance-statistics {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 16px;
    margin: 0 16px;
    border-radius: 16px;

    .statistics-item {
      flex: 1 0 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .item-value {
        font-size: 24px;
        font-weight: 600;
        // color: #2ba471;
      }

      .item-desc {
        font-size: 14px;
        color: #858a99;
      }
    }
  }

  :deep(.user-action-list) {
    --td-cell-left-icon-size: auto;

    .t-cell-group--card {
      border-radius: 16px !important;
    }

    .t-cell {
      align-items: center;
      line-height: 1;
      padding: 10px 16px;

      .t-cell__left,
      .t-cell__right {
        display: flex;
        align-items: center;
        line-height: 1;
      }
      .t-cell__title-text {
        font-weight: 500 !important;
      }
    }
  }

  .user-logout {
    --td-button-danger-outline-border-color: #ffcece;

    margin: 0 16px;
  }

  .system-version {
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #c9cdd4;
  }
}
</style>
