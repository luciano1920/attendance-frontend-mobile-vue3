/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/api/user-controller.ts
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

/** 修改用户个人密码 PUT /admin-api/system/user/profile/update-password */
export async function updateUserPasswordUsingPut(body: any, options?: { [key: string]: any }) {
  return request('/admin-api/system/user/profile/update-password', {
    method: 'PUT',
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
