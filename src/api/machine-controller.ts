/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-06
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-06
 * @FilePath     : /attendance-frontend-mobile/src/api/machine-controller.ts
 * @Description  : 打卡机位置模块-API接口
 */
import request from '@/libs/axios/request'

/** 获得打卡机位置分页 GET /admin-api/attenfront/machine/noPermissionPage */
export async function listMachineInfoByPageUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/admin-api/attenfront/machine/noPermissionPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
