/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-05
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/constants/access.ts
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

  // 普通用户角色
  person: ACCESS_ENUM.USER, // 员工
  common: ACCESS_ENUM.USER, // 普通角色
  DV: ACCESS_ENUM.USER, // 研发中心管理
  HR: ACCESS_ENUM.ADMIN, // 人力资源考勤管理
}

/** 权限级别权重（用于比较权限高低，数值越大权限越高）*/
export const ACCESS_WEIGHT: Record<string, number> = {
  [ACCESS_ENUM.NOT_LOGIN]: 0,
  [ACCESS_ENUM.USER]: 1,
  [ACCESS_ENUM.ADMIN]: 2,
}

/**
 * 根据用户角色代码判断用户权限级别
 * @param userRoles 用户角色数组
 * @returns 用户权限级别
 */
export const getUserAccessLevel = (userRoles: any[]): string => {
  // 如果用户没有角色，则返回未登录权限
  if (!userRoles || userRoles.length === 0) {
    return ACCESS_ENUM.NOT_LOGIN
  }

  // 遍历用户的所有角色，找到最高权限级别
  let maxWeight = 0
  let maxAccessLevel: string = ACCESS_ENUM.NOT_LOGIN

  for (const role of userRoles) {
    const accessLevel = ROLE_ACCESS_MAP[role.code]

    if (!accessLevel) continue

    const weight = ACCESS_WEIGHT[accessLevel]
    if (weight !== undefined && weight > maxWeight) {
      maxWeight = weight
      maxAccessLevel = accessLevel
    }
  }

  return maxAccessLevel
}
