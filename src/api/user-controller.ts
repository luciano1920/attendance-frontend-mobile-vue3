/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 09:51
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 15:09
 * @FilePath     : \attendance-frontend-mobile\src\api\user-controller.ts
 * @Description  : 用户模块-API接口
 */
import request from '@/libs/axios/request'

/** 获取登录用户信息 GET /admin-api/system/user/profile/get */
export async function fetchUserInfoUsingGet(options?: { [key: string]: any }) {
  return request('/admin-api/system/user/profile/get', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 获取用户绑定审批人信息 GET /admin-api/system/person-info/get */
export async function fetchApproverInfoUsingGet(options?: { [key: string]: any }) {
  return request('/admin-api/system/person-info/get', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 统一登陆时获取用户信息 GET /admin-api/system/auth/get-permission-info */
export async function fetchUnifiedUserInfoUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/auth/get-permission-info', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获取用户个人详情信息 POST /app-api/attenfront/facechange-record/get */
export async function fetchUserDetailInfoUsingGet(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/facechange-record/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 用户修改密码 POST /authserver/users/updatePass */
export async function updateUserPasswordUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/authserver/users/updatePass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 首页忘记密码保存 POST /authserver/users/forgotPass */
export async function saveUserPasswordUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/authserver/users/forgotPass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取假期代理人 POST /admin-api/system/user/getProxyUser */
export async function fetchAgentUserUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/user/getProxyUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
