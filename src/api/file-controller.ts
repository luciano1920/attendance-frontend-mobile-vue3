/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-24 09:04
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-24 14:38
 * @FilePath     : \attendance-frontend-mobile\src\api\file-controller.ts
 * @Description  : 文件服务模块-API接口
 */
import request from '@/libs/axios/request'

/** 文件上传 POST /admin-api/infra/file/upload */
export async function uploadFileUsingPost(data: any, options?: { [key: string]: any }) {
  return request('/admin-api/infra/file/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
    ...(options || {})
  })
}
