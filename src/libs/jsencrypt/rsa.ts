/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-27 16:48
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-29 10:53
 * @FilePath     : \attendance-frontend-mobile\src\libs\jsencrypt\rsa.ts
 * @Description  : RSA 加密解密
 */
import JSEncrypt from 'jsencrypt'

// RSA 公钥（用于加密）
const RSA_PUBLIC_KEY: string = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCkkkG3VBfCkx1H4FFSR7eE+s0epaYco4Tt9+HS7wMCAMXaRxSB99dUhLPSGk/ySiRTGCwU32oh0lglvOXiFMyIttGquKn2DYZ/TUchGLgOKAaDvoiVGn61s7+nkJ8yNjtuMkRCcZfCr8qVFLEmp7RrfWzM9gQ7yWjje3/RImyUOQIDAQAB`

// RSA 私钥（仅用于前端解密演示，生产环境切勿暴露私钥）
const RSA_PRIVATE_KEY: string = '这里是封装的私钥'

/**
 * RSA 加密
 * @param plainText - 明文字符串
 * @returns 加密后的 Base64 字符串，失败时返回 false
 */
export function rsaEncrypt(plainText: string): string | false {
  // 实例化 JSEncrypt 对象
  const encryptor = new JSEncrypt()
  // 设置 RSA 公钥
  encryptor.setPublicKey(RSA_PUBLIC_KEY)
  return encryptor.encrypt(plainText)
}

/**
 * RSA 解密
 * @param cipherText - Base64 密文字符串
 * @returns 解密后的明文字符串，失败时返回 false
 */
export function rsaDecrypt(cipherText: string): string | false {
  // 实例化 JSEncrypt 对象
  const decryptor = new JSEncrypt()
  // 设置 RSA 私钥
  decryptor.setPrivateKey(RSA_PRIVATE_KEY)
  return decryptor.decrypt(cipherText)
}
