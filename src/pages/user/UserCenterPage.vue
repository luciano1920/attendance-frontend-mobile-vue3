<!--
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-03-29 11:07
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-05-18 15:17
 * @FilePath     : \attendance-frontend-mobile\src\pages\user\UserCenterPage.vue
 * @Description  : 用户中心（我的）页面
-->
<template>
  <div id="user-center-page">
    <!-- 用户简介区域 -->
    <div class="user-profile">
      <div class="user-profile-info">
        <img
          :src="loginUserInfo.avatar || defaultAvatar"
          class="user-avatar"
          alt="avatar"
          @click="handlePreview([loginUserInfo.avatar || defaultAvatar])"
        />
        <!-- 头像预览 -->
        <t-image-viewer :images="previewImgs" :visible="imgVisible" @close="imgVisible = false" />

        <div class="user-name">{{ loginUserInfo.username }}</div>
        <div class="user-dept">
          <div>{{ loginUserInfo.dept?.name }}</div>
          <div>
            部门审批人：{{ loginUserInfo.checker[0]?.nickname }}（{{
              loginUserInfo.checker[0]?.dept
            }}）
          </div>
        </div>
      </div>
    </div>

    <!-- 用户操作区域 -->
    <div class="user-action">
      <t-cell-group theme="card" class="user-action-list">
        <!-- <t-cell title="消息中心" arrow hover>
          <template #leftIcon>
            <IconContainer icon="bell" theme="orange" />
          </template>
        </t-cell> -->
        <t-cell title="应用设置" arrow hover @click="router.push('/settings')">
          <template #leftIcon>
            <IconContainer icon="settings" theme="blue" />
          </template>
        </t-cell>
        <t-cell title="帮助中心" arrow hover @click="router.push('/help')">
          <template #leftIcon>
            <IconContainer icon="question-mark-circle" theme="green" />
          </template>
        </t-cell>
        <t-cell title="关于应用" arrow hover @click="router.push('/about')">
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

      <t-footer :text="systemTitle + ' ' + systemVersion" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ActionSheetPlugin, Message } from 'tdesign-mobile-vue'

import { logoutUsingPost } from '@/api/auth-controller'
import { useUserStore } from '@/stores/user-store'
import SvgIcon from '@/components/SvgIcon.vue'
import IconContainer from '@/components/IconContainer.vue'
import defaultAvatar from '@/assets/svgs/profile-avatar.svg'

const router = useRouter()
const userStore = useUserStore()
const loginUserInfo = userStore.loginUser.userInfo

const systemTitle = import.meta.env.VITE_APP_TITLE
const systemVersion = import.meta.env.VITE_APP_SYSTEM_VERSION

// 控制图片预览组件
const imgVisible = ref<boolean>(false)
// 预览图片列表
const previewImgs = ref<string[]>([])

/**
 * 处理预览
 * @param fileIds 预览文件的 Url 列表
 */
const handlePreview = (fileIds: string[]) => {
  previewImgs.value = fileIds
  imgVisible.value = true
}

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
            Message.success({ content: '退出登录成功', offset: [10, 16] })
            router.replace('/auth')
          } else {
            Message.error({
              content: '退出登录失败，' + res.data.msg,
              offset: [10, 16],
            })
          }
        } catch (error) {
          Message.error({ content: '退出登录失败，请稍后重试', offset: [10, 16] })
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
  padding: 32px 24px;
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
    gap: 12px;

    .user-avatar {
      width: 80px;
      height: 80px;
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

    .user-dept {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
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

  :deep(.user-action-list) {
    --td-cell-left-icon-size: auto;

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
}
</style>
