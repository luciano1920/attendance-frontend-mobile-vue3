/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/api/record-controller.ts
 * @Description  : 考勤记录管理模块-API接口
 */
import request from '@/libs/axios/request'

/** 获得一个月份的打卡记录 POST /app-api/attenfront/transaction-record/getByMonth */
export async function fetchRecordByMonthUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/transaction-record/getByMonth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获得一天的打卡记录 POST /app-api/attenfront/transaction-record/getByDay */
export async function fetchRecordByDayUsingPost(body: any, options?: { [key: string]: any }) {
  return request('/app-api/attenfront/transaction-record/getByDay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获得目前可以补卡的记录 POST /app-api/attenfront/transaction-record/getAttenCorrect */
export async function fetchAllowMakeupDayUsingPost(options?: { [key: string]: any }) {
  return request('/app-api/attenfront/transaction-record/getAttenCorrect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  })
}
