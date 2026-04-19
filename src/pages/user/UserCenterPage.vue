<!--
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-29 11:07
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-04-18 21:27
 * @FilePath     : \attendance-frontend-mobile\src\pages\user\UserCenterPage.vue
 * @Description  : 用户中心（我的）页面
-->
<template>
  <div id="user-center-page">
    <!-- 用户简介区域 -->
    <div class="user-profile">
      <div class="user-profile-title">
        <div style="color: #001442; font-size: 24px; font-weight: 700">个人中心</div>
        <SvgIcon name="bell" size="20px" color="#858a99" />
      </div>
      <div class="user-profile-info">
        <img
          :src="loginUserInfo.avatar || '@/assets/images/avatar.png'"
          class="user-avatar"
          alt="avatar"
        />
        <div class="user-desc">
          <div class="user-name">{{ loginUserInfo.username }}</div>
          <div class="user-role">
            <span>{{ loginUserInfo.dept?.name }}</span>
            <!-- <span>·</span>
            <span>研发工程师</span> -->
          </div>
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
        <t-cell title="考勤设置" arrow hover>
          <template #leftIcon>
            <SvgIcon name="settings" size="20px" color="#858a99" />
          </template>
        </t-cell>
        <t-cell title="帮助中心" arrow hover>
          <template #leftIcon>
            <SvgIcon name="question-mark-circle" size="20px" color="#858a99" />
          </template>
        </t-cell>
        <t-cell title="关于系统" arrow hover>
          <template #leftIcon>
            <SvgIcon name="info" size="20px" color="#858a99" />
          </template>
        </t-cell>
      </t-cell-group>

      <t-button size="large" class="user-logout" @click="handleLogout">
        <SvgIcon name="log-out" />
        退出登录
      </t-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { logoutUsingPost } from '@/api/auth-controller'
import { ActionSheetPlugin, Message } from 'tdesign-mobile-vue'
import { useUserStore } from '@/stores/user-store'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

// 统计数据
const statisticsData = [
  { value: 10, desc: '本月打卡', color: '#2ba471' },
  { value: 8, desc: '补卡', color: '#e37318' },
  { value: 5, desc: '无需打卡', color: '#0052d9' },
  { value: 2, desc: '缺卡', color: '#d54941' }
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
            ActionSheetPlugin.close()
            userStore.resetUserState()
            Message.success('退出登录成功')
            router.replace('/auth')
          } else {
            Message.error('退出登录失败，' + res.data.msg)
          }
        } catch (error) {
          Message.error('退出登录失败，请稍后重试')
          console.error('退出登录错误:', error)
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 24px 32px;
  background-color: #fff;

  .user-profile-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-profile-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
      padding: 1px;
    }

    .user-desc {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;

      .user-name {
        font-size: 20px;
        font-weight: 600;
        color: rgb(15, 23, 43);
      }

      .user-role {
        font-size: 14px;
        color: rgb(98, 116, 142);
      }
    }
  }
}

.user-action {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  height: calc(100vh - 200px);

  .user-attendance-statistics {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 16px;
    margin: 0 16px;
    border-radius: 16px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);

    .statistics-item {
      flex: 1 0 25%;
      display: flex;
      flex-direction: column;
      align-items: center;

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
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
    }

    .t-cell {
      align-items: center;
      line-height: 1;

      .t-cell__left,
      .t-cell__right {
        display: flex;
        align-items: center;
        line-height: 1;
      }
    }
  }

  .user-logout {
    margin: 0 16px;
    background-color: #fff;
    color: #d54941;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
