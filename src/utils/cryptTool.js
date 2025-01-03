/*** 
 * @Author: trexwb
 * @Date: 2024-01-17 19:33:14
 * @LastEditors: trexwb
 * @LastEditTime: 2025-01-03 09:57:36
 * @FilePath: /git/application_framework/src/utils/cryptTool.js
 * @Description: 
 * @一花一世界，一叶一如来
 * @Copyright (c) 2024 by 杭州大美, All Rights Reserved. 
 */
'use strict';
const crypto = require('crypto');
// md5加密
const md5 = (str) => {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
}
// 使用更安全的哈希算法 SHA-256 替换 MD5
const sha256 = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
  // 使用 crypto-js 创建 SHA-256 哈希
  // return CryptoJS.SHA256(str).toString();
  // return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
  /**
   * js实现方式
   * const script = document.createElement('script');
   * script.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
   * document.head.appendChild(script);
   * 
   * const str = "4624441376606905jyj43VO3CQwyzrqEFv2CjNKvk6a8SehA1234567890";
   * // const encryptedData = CryptoJS.SHA256(str).toString();
   * // const encryptedData = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
   */
}
// 加密函数
const encrypt = (encryptedData, key, iv) => {
  try {
    // 验证 key 和 iv 的长度
    if (Buffer.byteLength(key) !== 32 || Buffer.byteLength(iv) !== 16) {
      throw new Error('Invalid key or iv length');
    }

    const encryptedText = JSON.stringify(encryptedData);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(encryptedText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}
// 解密函数
const decrypt = (encryptedText, key, iv) => {
  try {
    // 验证 key 和 iv 的长度
    if (Buffer.byteLength(key) !== 32 || Buffer.byteLength(iv) !== 16) {
      throw new Error('Invalid key or iv length');
    }

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // 验证解密后的字符串是否为有效的 JSON
    try {
      return JSON.parse(decrypted);
    } catch (jsonError) {
      throw new Error('Invalid JSON format after decryption');
    }
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}
// HMAC-SHA1 签名函数
const sha1 = (encryptedData, key) => {
  return crypto.createHmac('sha1', key).update(encryptedData).digest('base64');
}

module.exports = {
  md5,
  sha256,
  encrypt,
  decrypt,
  sha1
}