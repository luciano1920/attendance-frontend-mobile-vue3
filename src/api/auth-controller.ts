/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 09:04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-24 09:56
 * @FilePath     : \attendance-frontend-mobile\src\api\auth-controller.ts
 * @Description  : 认证模块-API接口
 */
import request from '@/libs/axios/request'

/** 登录 POST /admin-api/system/auth/login */
export async function loginUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 退出登录 POST /admin-api/system/auth/logout */
export async function logoutUsingPost(options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/logout', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 获取图形验证码 POST /admin-api/system/captcha/get */
export async function fetchImageCaptchaUsingGet(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/captcha/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 校验图形验证码 POST /admin-api/system/captcha/check */
export async function checkImageCaptchaUsingGet(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/captcha/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取手机短信验证码 POST /admin-api/system/auth/send-sms-code */
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

/** 短信验证后登录 POST /admin-api/system/auth/sms-login */
export async function loginWithSmsVerificationCode(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/sms-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 统一登陆 GET /admin-api/system/auth/getToken */
export async function unifiedLoginUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/getToken', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取天翼认证登录框地址 GET /admin-api/tianyi/auth/getLoginUrl */
export async function fetchTelecomLoginUrlUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/tianyi/auth/getLoginUrl', {
    method: 'GET',
    params: {
      ...params,
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
export async function telecomLogoutUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/tianyi/auth/logout', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
