/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/api/captcha-controller.ts
 * @Description  : 人机验证-图形验证码模块-API接口
 */
import request from '@/libs/axios/request'

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
