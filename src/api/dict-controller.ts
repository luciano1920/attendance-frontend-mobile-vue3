/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 09:04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-24 14:41
 * @FilePath     : \attendance-frontend-mobile\src\api\dict-controller.ts
 * @Description  : 全局字典配置模块-API接口
 */
import request from '@/libs/axios/request'

/** 根据字典标识键获取字典选项列表 GET /app-api/system/dict-data/type */
export async function fetchDictOptionsListUsingGet(params: any, options?: { [key: string]: any }) {
  return request('/app-api/system/dict-data/type', {
    method: 'GET',
    params,
    ...(options || {})
  })
}
