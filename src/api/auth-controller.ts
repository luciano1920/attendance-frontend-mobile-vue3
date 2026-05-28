/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/api/auth-controller.ts
 * @Description  : 认证模块-API接口
 */
import request from '@/libs/axios/request'

/** 注册用户 POST /admin-api/system/auth/register */
export async function userRegisterUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 使用账号密码登录 POST /admin-api/system/auth/login */
export async function userLoginUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 发送手机验证码 POST /admin-api/system/auth/send-sms-code */
export async function fetchSmsVerificationCodeUsingGet(
  body: any,
  options?: { [key: string]: any },
) {
  return request('/admin-api/system/auth/send-sms-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 使用短信验证码登录 POST /admin-api/system/auth/sms-login */
export async function userLoginWithSmsUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/sms-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据统一认证code获取系统token（使用 code 统一登陆） GET /admin-api/system/auth/getToken */
export async function unifiedLoginUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/getToken', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 登出系统 POST /admin-api/system/auth/logout */
export async function userLogoutUsingPost(options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 重置密码（需要获取短信验证码） POST /admin-api/system/auth/reset-password */
export async function resetPasswordWithSmsUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 刷新令牌 POST /admin-api/system/auth/refresh-token */
export async function userRefreshTokenUsingPost(params: any, options?: { [key: string]: any }) {
  return await request('/admin-api/system/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取登录用户的权限信息 GET /admin-api/system/auth/get-permission-info */
export async function fetchUserPermissionUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/get-permission-info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

// ------------------------------- 天翼认证 -------------------------------

/** 获取天翼认证登录框地址 GET /admin-api/tianyi/auth/getLoginUrl */
export async function fetchTelecomLoginUrlUsingGet(options?: { [key: string]: any }) {
  const { origin, pathname } = window.location
  const basePath = pathname.split('/')[1] || ''
  const fullReferer = `${origin}${basePath ? `/${basePath}` : ''}/auth/`

  return request('/admin-api/tianyi/auth/getLoginUrl', {
    method: 'GET',
    headers: {
      redirectTarget: 'phone',
      'X-Full-Referer': fullReferer,
    },
    ...(options || {}),
  })
}

/** 天翼认证执行登录 GET /admin-api/tianyi/auth/login */
export async function telecomLoginUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/tianyi/auth/login', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 天翼认证退出登录 GET /admin-api/tianyi/auth/logout */
export async function telecomLogoutUsingGet(options?: { [key: string]: any }) {
  const { origin, pathname } = window.location
  const basePath = pathname.split('/')[1] || ''
  const fullReferer = `${origin}${basePath ? `/${basePath}` : ''}/auth/`

  return request('/admin-api/tianyi/auth/logout', {
    method: 'GET',
    headers: {
      'X-Full-Referer': fullReferer,
    },
    ...(options || {}),
  })
}
