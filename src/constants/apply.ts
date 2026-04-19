/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-30 11:02
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-30 14:32
 * @FilePath     : \attendance-frontend-mobile\src\constants\apply.ts
 * @Description  : 考勤申请相关 常量类
 */

// 定义申请类型的配置接口
export interface ApplyConfig {
  icon: string
  color: string
  bgColor: string
  name: string
  description: string
}

// 定义申请类型枚举
export enum ApplyTypeEnum {
  LEAVE = 'leave',
  COMP_OFF = 'compOff',
  FIELD_WORK = 'fieldWork',
  MISSED_PUNCH = 'missedPunch',
  FACE_UPDATE = 'faceUpdate'
}

// 定义申请类型到配置的映射
export const APPLY_CONFIG_MAP: Record<ApplyTypeEnum, ApplyConfig> = {
  [ApplyTypeEnum.LEAVE]: {
    icon: 'coffee',
    color: '#f54900',
    bgColor: '#ffedd4',
    name: '请假',
    description: '事假/病假/年假等'
  },
  [ApplyTypeEnum.COMP_OFF]: {
    icon: 'sun',
    color: '#009966',
    bgColor: '#d0fae5',
    name: '调休',
    description: '加班时长兑换'
  },
  [ApplyTypeEnum.FIELD_WORK]: {
    icon: 'plane',
    color: '#155dfb',
    bgColor: '#dbeafe',
    name: '外出/公出',
    description: '因公外出办事'
  },
  [ApplyTypeEnum.MISSED_PUNCH]: {
    icon: 'clipboard-pen',
    color: '#9810fa',
    bgColor: '#f3e8ff',
    name: '补卡',
    description: '忘打卡补录'
  },
  [ApplyTypeEnum.FACE_UPDATE]: {
    icon: 'scan-face',
    color: '#e60076',
    bgColor: '#fce7f3',
    name: '人脸录入',
    description: '更新打卡人脸信息'
  }
}

// 获取常用申请列表
export const getCommonApplyList = (): ApplyConfig[] => {
  return [
    APPLY_CONFIG_MAP[ApplyTypeEnum.LEAVE],
    APPLY_CONFIG_MAP[ApplyTypeEnum.COMP_OFF],
    APPLY_CONFIG_MAP[ApplyTypeEnum.FIELD_WORK],
    APPLY_CONFIG_MAP[ApplyTypeEnum.MISSED_PUNCH]
  ]
}

// 获取人脸录入配置
export const getFaceUpdateApplyConfig = (): ApplyConfig => {
  return APPLY_CONFIG_MAP[ApplyTypeEnum.FACE_UPDATE]
}
