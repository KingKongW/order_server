import * as errorMsg from "../config/error_msg";
import * as crypto from "crypto";
import * as db from "../model/dao/db";
import * as logger from "../config/logger";
import * as CryptoJS from "crypto-js";

/**
 * 生成md5
 * @param text
 * @returns md5
 */
export function md5(text: string) {
    return crypto.createHash("md5").update(text).digest("hex");
};

/**
 * 生成token
 */
export function token(data: any) {
    return crypto.createHash("md5").update(data + (new Date().getTime()).toString()).digest("hex");
};

export function token_promise(val: any) {
    return new Promise(function (resolve, reject) {
        try {
            resolve(token(val));
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * DES 解密
 */
export function desDecrypt(text: string, key: string) {
    key = key.length >= 16 ? key.slice(0, 16) : [key].concat("0".repeat(16 - key.length)).join("");
    let bytes = CryptoJS.TripleDES.decrypt(text.toString(), key);
    let decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
}