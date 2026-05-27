/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/api/apply-controller.ts
 * @Description  : 考勤申请模块-API接口
 */
import request from '@/libs/axios/request'

/** 创建请假申请 POST /app-api/attenfront/leave-record/create */
export async function createLeaveApplyUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/leave-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 创建外出申请 POST /app-api/attenfront/travel-record/create */
export async function createOutingApplyUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/travel-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 创建调休申请 POST /app-api/attenfront/comp-leave-record/create */
export async function createRestApplyUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/comp-leave-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 创建补卡申请 POST /app-api/attenfront/atten-correction-record/create */
export async function createMakeupApplyUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/atten-correction-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 创建人脸变更申请 POST /app-api/attenfront/facechange-record/create */
export async function createFaceUpdateApplyUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/facechange-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取人脸变更申请记录 POST /app-api/attenfront/facechange-record/get */
export async function fetchFaceUpdateRecordUsingGet(options?: { [key: string]: any }) {
  return request('/app-api/attenfront/facechange-record/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  })
}

/** 计算时间段内的实际需考勤天数 POST /app-api/attenfront/holiday/calc */
export async function calcActualApplyDaysUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/holiday/calc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
