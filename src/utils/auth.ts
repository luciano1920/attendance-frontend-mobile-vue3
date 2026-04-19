/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 16:37
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-27 10:28
 * @FilePath     : \attendance-frontend-mobile\src\utils\auth.ts
 * @Description  : 认证相关工具函数
 */

export const TOKEN_KEY = 'attendance-mobile__token' // Token 存储 Key
export const REFRESH_TOKEN_KEY = 'attendance-mobile__refresh-token' // RefreshToken 存储 Key
export const EXPIRES_TIME_KEY = 'attendance-mobile__expires-time' // ExpiresTime 存储 Key

/**
 * 获取 Token
 */
export function getTokenUtil(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置 Token
 * @param token Token 字符串
 */
export function setTokenUtil(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

/**
 * 移除 Token
 */
export function removeTokenUtil(): void {
  localStorage.removeItem(TOKEN_KEY)
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
  removeTokenUtil()
  removeRefreshTokenUtil()
  removeExpiresTimeUtil()
}
