/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-03-20 15:42
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-21 23:52
 * @FilePath     : \attendance-frontend-mobile\src\router\routes.ts
 * @Description  : 所有路由配置
 */

import { type RouteRecordRaw } from 'vue-router'
import MobileLayout from '@/layouts/MobileLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

export const routes: Array<RouteRecordRaw> = [
  // 天翼登录中间页
  {
    path: '/tianyiBox',
    name: '天翼认证中间页',
    component: () => import('@/pages/auth/TelecomLoginPage.vue'),
    meta: {
      title: '天翼认证',
    },
  },

  // 认证页面，使用 AuthLayout
  {
    path: '/auth',
    redirect: '/auth/portal',
    name: 'AuthLayout',
    component: AuthLayout,
    children: [
      // 认证入口门户
      {
        path: 'portal',
        name: '认证入口门户',
        component: () => import('@/pages/auth/AuthPortalPage.vue'),
        meta: {
          title: '认证门户',
        },
      },
      // 用户登录
      {
        path: 'login',
        name: '账号密码登录页',
        component: () => import('@/pages/auth/UserLoginPage.vue'),
        meta: {
          title: '用户登录',
        },
      },
      // 用户注册
      {
        path: 'register',
        name: '用户注册页',
        component: () => import('@/pages/auth/UserRegisterPage.vue'),
        meta: {
          title: '用户注册',
        },
      },
      // 用户忘记密码重置页
      {
        path: 'forgot',
        name: '用户重置密码页',
        component: () => import('@/pages/auth/UserForgotPage.vue'),
        meta: {
          title: '忘记密码',
        },
      },

      // 无权限页面
      {
        path: 'unauthorized',
        name: '无权限跳转到的页面',
        component: () => import('@/pages/auth/UnauthorizedPage.vue'),
        meta: {
          title: '无权限',
        },
      },
    ],
  },

  // 其他页面使用 MobileLayout
  {
    path: '/',
    name: 'MobileLayout',
    component: MobileLayout,
    children: [
      // 主页
      {
        path: '',
        name: '主页',
        component: () => import('@/pages/home/HomePage.vue'),
        meta: {
          // access: ACCESS_ENUM.USER,
        },
      },
      // 考勤申请页
      {
        path: 'apply',
        name: '考勤申请页',
        component: () => import('@/pages/apply/ApplyPage.vue'),
        meta: {
          title: '考勤申请',
        },
      },
      // 考勤审核页
      {
        path: 'approve',
        name: '考勤审核页',
        component: () => import('@/pages/approve/ApprovePage.vue'),
        meta: {
          title: '考勤审核',
        },
      },
      // 用户中心页（我的）
      {
        path: 'profile',
        name: '用户中心页（我的）',
        component: () => import('@/pages/user/UserCenterPage.vue'),
        meta: {
          title: '我的',
        },
      },
    ],
  },

  {
    path: '/apply/leave',
    name: '请假申请页',
    component: () => import('@/pages/apply/LeaveFormPage.vue'),
    meta: {
      title: '请假申请',
    },
  },
]
