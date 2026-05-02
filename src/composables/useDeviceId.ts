/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-28 18:37
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-29 10:53
 * @FilePath     : \attendance-frontend-mobile\src\composables\useDeviceId.ts
 * @Description  : 设备唯一标识符（UUID）的组合式函数
 */
import { ref, readonly } from 'vue'

/**
 * 生成符合 UUID v4 规范的字符串
 * 优先使用 crypto.getRandomValues 生成随机数（若环境不支持则降级为 Math.random）
 * @returns {string} 标准 UUID 字符串
 */
function generateUUID(): string {
  const hexDigits = '0123456789abcdef'
  const uuid: string[] = new Array(36)

  // 生成 16 字节（128 位）随机数
  const randomBytes = new Uint8Array(16)
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomBytes)
  } else {
    // 降级方案：使用 Math.random（不适合高安全场景）
    for (let i = 0; i < 16; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256)
    }
  }

  for (let i = 0; i < 36; i++) {
    // 在固定位置插入连字符
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid[i] = '-'
      continue
    }

    // 每 2 个 UUID 字符对应一个随机字节
    const byteIndex = Math.floor(i / 2)
    const isHighNibble = i % 2 === 0
    let nibble = isHighNibble
      ? ((randomBytes[byteIndex] as number) >> 4) & 0x0f // 取高四位
      : (randomBytes[byteIndex] as number & 0x0f) // 取低四位

    // 设置 UUID 版本号（第 15 个字符，索引 14）
    if (i === 14) {
      nibble = 4
    }
    // 设置变体位（第 20 个字符，索引 19）
    else if (i === 19) {
      nibble = (nibble & 0x3) | 0x8 // 高两位设为 10
    }

    uuid[i] = hexDigits[nibble] as string
  }

  return uuid.join('')
}

// 模块级单例缓存，确保全局只有一个设备 ID 实例
let cachedDeviceId: ReturnType<typeof ref<string>> | null = null

/**
 * 设备唯一标识符（UUID）的组合式函数
 * - 自动从 localStorage 读取已有设备 ID，若不存在则生成并存储
 * - 返回只读的 deviceId 响应式引用，以及重新生成的方法
 * - 全局单例，所有组件共享同一设备 ID
 */
export const useDeviceId = () => {
  // 如果未初始化，则创建单例
  if (cachedDeviceId === null) {
    // 尝试读取本地存储
    let storedId: string | null = null
    try {
      storedId = localStorage.getItem('deviceId')
    } catch (error) {
      console.warn('localStorage 不可用，无法读取设备 ID', error)
    }

    // 生成或使用已有 ID
    const initialId = storedId || generateUUID()
    const deviceIdRef = ref<string>(initialId)

    // 若本地无记录，则写入存储
    if (!storedId) {
      try {
        localStorage.setItem('deviceId', initialId)
      } catch (error) {
        console.warn('localStorage 写入失败，设备 ID 可能无法持久化', error)
      }
    }

    cachedDeviceId = deviceIdRef
  }

  /** 强制重新生成设备 ID，并更新本地存储 */
  const regenerate = () => {
    const newId = generateUUID()
    cachedDeviceId!.value = newId
    try {
      localStorage.setItem('deviceId', newId)
    } catch (error) {
      console.warn('更新 localStorage 中的设备 ID 失败', error)
    }
  }

  // 返回只读的设备 ID（避免外部直接修改）以及重新生成方法
  return {
    deviceId: readonly(cachedDeviceId),
    regenerate,
  }
}
