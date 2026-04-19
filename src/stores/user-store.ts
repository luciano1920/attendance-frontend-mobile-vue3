/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-20 16:39
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-27 10:32
 * @FilePath     : \attendance-frontend-mobile\src\stores\user-store.ts
 * @Description  : 用户信息全局状态
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'

import { fetchUserInfoUsingGet } from '@/api/user-controller'
import {
  clearAuthInfoUtil,
  getExpiresTimeUtil,
  getRefreshTokenUtil,
  getTokenUtil,
  setExpiresTimeUtil,
  setRefreshTokenUtil,
  setTokenUtil
} from '@/utils/auth'

//------ 默认用户信息结构 ------
interface UserInfoVO {
  /** 用户id */
  id: number | null
  /** 用户账号 */
  username: string
  /** 用户昵称 */
  nickname: string
  /** 用户手机号 */
  mobile: string
  /** 用户邮箱 */
  email: string
  /** 用户性别 */
  sex: number
  /** 用户头像 */
  avatar: string
  /** 用户类型 */
  userType: number
  /** 用户登录ip */
  loginIp: string
  /** 用户登录时间 */
  loginDate: string
  /** 用户创建时间 */
  createTime: string
  /** 用户角色 */
  roles: any[]
  /** 用户部门 */
  dept: any
  /** 用户岗位 */
  posts: any[]
  /** 部门审批人 */
  approver: any[]
}

interface LoginUserVO {
  accessToken: string | null
  refreshToken: string | null
  expiresTime: string | null
  userInfo: UserInfoVO
}

interface TokenInfo {
  accessToken: string | null
  refreshToken: string | null
  expiresTime: string | null
}

/**
 * 用户登录信息全局状态
 */
export const useUserStore = defineStore('user', () => {
  // ---------- state ----------
  const loginUser = ref<LoginUserVO>({
    accessToken: getTokenUtil(),
    refreshToken: getRefreshTokenUtil(),
    expiresTime: getExpiresTimeUtil(),
    userInfo: {} as UserInfoVO
  })

  // ---------- actions ----------
  /** 重置令牌（仅清除本地） */
  function resetUserState() {
    clearAuthInfoUtil()
    loginUser.value = {
      accessToken: null,
      refreshToken: null,
      expiresTime: null,
      userInfo: {} as UserInfoVO
    }
  }

  /** 获取登录用户信息 */
  async function fetchLoginUserInfo() {
    const res = await fetchUserInfoUsingGet()
    if (res.data.code === 0 && res.data.data) {
      loginUser.value.userInfo = res.data.data
    }
  }

  /**
   * 设置登录用户信息
   * @param newLoginUser 传入完整的 LoginUserVO 对象或仅传入 TokenInfo 信息
   */
  function setLoginUserInfo(newLoginUser: LoginUserVO | TokenInfo) {
    if ('userInfo' in newLoginUser) {
      // 传入完整的 LoginUserVO 对象
      loginUser.value = newLoginUser
    } else {
      // 仅传入 accessToken、refreshToken、expiresTime
      loginUser.value.accessToken = newLoginUser.accessToken
      loginUser.value.refreshToken = newLoginUser.refreshToken
      loginUser.value.expiresTime = newLoginUser.expiresTime
      setTokenUtil(newLoginUser.accessToken)
      setRefreshTokenUtil(newLoginUser.refreshToken)
      setExpiresTimeUtil(newLoginUser.expiresTime)
    }
  }

  return {
    // state
    loginUser,

    // actions
    fetchLoginUserInfo,
    resetUserState,
    setLoginUserInfo
  }
})
