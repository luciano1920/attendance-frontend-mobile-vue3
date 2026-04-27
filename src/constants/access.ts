/**
 * @Author       : luciano1920 1290582790@qq.com
 * @Date         : 2026-04-27 10:01
 * @LastEditors  : luciano1920 1290582790@qq.com
 * @LastEditTime : 2026-04-27 11:14
 * @FilePath     : \attendance-frontend-mobile\src\constants\access.ts
 * @Description  : 鉴权模块常量类
 */

/** 权限等级 */
export const ACCESS_ENUM = {
  NOT_LOGIN: 'not_login', // 无需登录
  USER: 'user', // 普通用户
  ADMIN: 'admin', // 管理员
} as const

/** 后端角色标识 → 权限等级映射 */
export const ROLE_ACCESS_MAP: Record<string, string> = {
  // 管理员角色
  dk_checker_dept: ACCESS_ENUM.ADMIN, // 部门一把手
  dk_checker_dept2: ACCESS_ENUM.ADMIN, // 部门二把手
  super_admin: ACCESS_ENUM.ADMIN, // 超级管理员
  HR: ACCESS_ENUM.ADMIN, // 人力资源考勤管理
  DV: ACCESS_ENUM.ADMIN, // 研发中心管理

  // 普通用户角色
  person: ACCESS_ENUM.USER, // 员工
  common: ACCESS_ENUM.USER, // 普通角色
}

/** 权限级别权重（用于比较权限高低，数值越大权限越高）*/
export const ACCESS_WEIGHT: Record<string, number> = {
  [ACCESS_ENUM.NOT_LOGIN]: 0,
  [ACCESS_ENUM.USER]: 1,
  [ACCESS_ENUM.ADMIN]: 2,
}
