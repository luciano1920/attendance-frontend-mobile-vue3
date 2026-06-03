/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/router/routes.ts
 * @Description  : 路由配置
 */
import { type RouteRecordRaw } from 'vue-router'
import MobileLayout from '@/layouts/MobileLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ACCESS_ENUM } from '@/constants/access'

export const routes: Array<RouteRecordRaw> = [
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
      // {
      //   path: 'register',
      //   name: '用户注册页',
      //   component: () => import('@/pages/auth/UserRegisterPage.vue'),
      //   meta: {
      //     title: '用户注册',
      //   },
      // },
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
      // 天翼登录中间页
      {
        path: 'tianyiBox',
        name: '天翼认证中间页',
        component: () => import('@/pages/auth/TelecomLoginPage.vue'),
        meta: {
          title: '天翼认证',
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
          access: ACCESS_ENUM.USER,
        },
      },
      // 考勤申请页
      {
        path: 'apply',
        name: '考勤申请页',
        component: () => import('@/pages/apply/ApplyPage.vue'),
        meta: {
          title: '申请',
          access: ACCESS_ENUM.USER,
        },
      },
      // 记录列表页
      {
        path: 'record',
        name: '申请记录列表页',
        component: () => import('@/pages/record/RecordPage.vue'),
        meta: {
          title: '记录',
          access: ACCESS_ENUM.USER,
        },
      },
      // 用户中心页（我的）
      {
        path: 'profile',
        name: '用户中心页（我的）',
        component: () => import('@/pages/system/UserCenterPage.vue'),
        meta: {
          title: '我的',
          access: ACCESS_ENUM.USER,
        },
      },
    ],
  },

  // 不需要全局布局的页面
  {
    path: '/rules',
    name: '考勤规则页',
    component: () => import('@/pages/home/AttendanceRulesPage.vue'),
    meta: {
      title: '考勤规则',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/apply/leave',
    name: '请假申请页',
    component: () => import('@/pages/apply/LeaveFormPage.vue'),
    meta: {
      title: '请假申请',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/apply/makeup',
    name: '补卡申请页',
    component: () => import('@/pages/apply/MakeupFormPage.vue'),
    meta: {
      title: '补卡申请',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/apply/outing',
    name: '外出申请页',
    component: () => import('@/pages/apply/OutingFormPage.vue'),
    meta: {
      title: '外出申请',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/apply/rest',
    name: '调休申请页',
    component: () => import('@/pages/apply/RestFormPage.vue'),
    meta: {
      title: '调休申请',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/apply/face-update',
    name: '人脸变更申请页',
    component: () => import('@/pages/apply/FaceUpdateFormPage.vue'),
    meta: {
      title: '人脸变更申请',
      access: ACCESS_ENUM.USER,
    },
  },
  // 申请记录详情页（普通用户查看 / 撤销）
  {
    path: '/record/:id',
    name: '申请详情页',
    component: () => import('@/pages/record/RecordDetailPage.vue'),
    props: true, // 将路由参数作为组件的 props 传递
    meta: {
      title: '申请详情',
      access: ACCESS_ENUM.USER,
    },
  },
  // 申请审批页（审批人 通过/驳回）
  {
    path: '/record/:id/approve',
    name: '申请审批页',
    component: () => import('@/pages/record/RecordApprovePage.vue'),
    props: true, // 将路由参数作为组件的 props 传递
    meta: {
      title: '审批详情',
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: '/settings',
    name: '用户设置页',
    component: () => import('@/pages/system/UserSettingsPage.vue'),
    meta: {
      title: '应用设置',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/device',
    name: '打卡设备列表页',
    component: () => import('@/pages/system/DeviceListPage.vue'),
    meta: {
      title: '打卡机列表',
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/update-password',
    name: '用户修改个人密码页',
    component: () => import('@/pages/system/UpdatePasswordPage.vue'),
    meta: {
      title: '修改密码',
      access: ACCESS_ENUM.USER,
    },
  },
  // {
  //   path: '/about',
  //   name: '关于系统页',
  //   component: () => import('@/pages/system/AboutSystemPage.vue'),
  //   meta: {
  //     title: '关于系统',
  //     access: ACCESS_ENUM.USER,
  //   },
  // },
  // {
  //   path: '/help',
  //   name: '帮助中心页',
  //   component: () => import('@/pages/system/HelpCenterPage.vue'),
  //   meta: {
  //     title: '帮助中心',
  //     access: ACCESS_ENUM.USER,
  //   },
  // },
]
