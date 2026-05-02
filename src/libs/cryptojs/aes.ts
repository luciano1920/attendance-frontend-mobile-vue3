/**
 * @Author       : 罗钧 71233895@chinatelecom.cn
 * @Date         : 2026-03-28 16:34
 * @LastEditors  : 罗钧 71233895@chinatelecom.cn
 * @LastEditTime : 2026-03-29 10:53
 * @FilePath     : \attendance-frontend-mobile\src\libs\cryptojs\aes.ts
 * @Description  : AES 加密解密
 */
import CryptoJS from 'crypto-js'

const AES_KEY_DEFAULT = 'XwKsGlMcdPMEhR1B'

/**
 * AES 加密（ECB 模式，PKCS7 填充）
 * @param word 要加密的明文字符串
 * @param keyWord 加密密钥
 * @returns 加密后的 Base64 字符串
 */
export function aesEncrypt(word: string, keyWord: string = AES_KEY_DEFAULT): string {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const secs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(secs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

/**
 * AES 解密（ECB 模式，PKCS7 填充）
 * @param word 要解密的密文字符串（Base64 格式）
 * @param keyWord 解密密钥
 * @returns 解密后的明文字符串
 */
export function aesDecrypt(word: string, keyWord: string = AES_KEY_DEFAULT): string {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
