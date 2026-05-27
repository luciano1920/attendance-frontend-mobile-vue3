/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-05
 * @FilePath     : /attendance-frontend-mobile/src/utils/auth.ts
 * @Description  : 认证相关工具函数
 */

export const ACCESS_TOKEN_KEY = 'attendance-mobile__access-token' // Token 存储 Key
export const REFRESH_TOKEN_KEY = 'attendance-mobile__refresh-token' // RefreshToken 存储 Key
export const EXPIRES_TIME_KEY = 'attendance-mobile__expires-time' // ExpiresTime 存储 Key

/**
 * 获取 AccessToken
 */
export function getAccessTokenUtil(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * 设置 AccessToken
 * @param token AccessToken 字符串
 */
export function setAccessTokenUtil(token: string | null): void {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

/**
 * 移除 AccessToken
 */
export function removeAccessTokenUtil(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

/**
 * 获取 RefreshToken
 */
export function getRefreshTokenUtil(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 设置 RefreshToken
 * @param token RefreshToken 字符串
 */
export function setRefreshTokenUtil(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  }
}

/**
 * 移除 RefreshToken
 */
export function removeRefreshTokenUtil(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * 获取 ExpiresTime
 */
export function getExpiresTimeUtil(): string | null {
  return localStorage.getItem(EXPIRES_TIME_KEY)
}

/**
 * 设置 ExpiresTime
 * @param time ExpiresTime 时间戳
 */
export function setExpiresTimeUtil(time: string | null): void {
  if (time) {
    localStorage.setItem(EXPIRES_TIME_KEY, time)
  }
}

/**
 * 移除 ExpiresTime
 */
export function removeExpiresTimeUtil(): void {
  localStorage.removeItem(EXPIRES_TIME_KEY)
}

/**
 * 清除所有认证信息（Token + RefreshToken + ExpiresTime）
 */
export function clearAuthInfoUtil(): void {
  removeAccessTokenUtil()
  removeRefreshTokenUtil()
  removeExpiresTimeUtil()
}
