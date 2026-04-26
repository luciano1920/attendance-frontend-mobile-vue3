/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-23 14:57
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-23 15:41
 * @FilePath     : \attendance-frontend-mobile\src\api\approve-controller.ts
 * @Description  : 考勤审批模块-API接口
 */

import request from '@/libs/axios/request'

/** 审批考勤申请 POST /app-api/attenfront/order-flow/check */
export async function approveApplicationUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/order-flow/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获得申请审批记录 GET /app-api/attenfront/order-flow/get */
export async function fetchApprovalRecordDetailUsingGet(
  params: any,
  options?: { [key: string]: any },
) {
  return request('/app-api/attenfront/order-flow/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 获得申请审批记录分页 POST /app-api/attenfront/order-flow/page */
export async function fetchApprovalRecordByPageUsingPost(
  body: any,
  options?: { [key: string]: any },
) {
  return request('/app-api/attenfront/order-flow/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取考勤审批人员 GET /app-api/attenfront/order-flow/checkPerson */
export async function fetchApproversUsingGet(options?: { [key: string]: any }) {
  return request('/app-api/attenfront/order-flow/checkPerson', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 撤销申请 GET /app-api/attenfront/order-flow/cancel */
export async function revokeApplicationUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/order-flow/cancel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
