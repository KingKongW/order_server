import * as  moment from "moment";
import * as  _ from "lodash";
import * as crypto from "crypto";

export function md5(data: string): string {
    return crypto.createHash("md5").update(data).digest("hex");
};

/**
 * 格式化日期
 */
export function dateFormat(date: any, formatStr: string) {
    if (!date) return "";
    if (typeof date === "string" || typeof date === "object") date = new Date(date);

    return moment(date).format(formatStr);
};

export function dateFormat_dayHours(date: any) {
    if (!date) return "";
    if (typeof date === "string" || typeof date === "object") date = new Date(date);

    return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export function dateFormat_day(date: any) {
    if (!date) return "";
    if (typeof date === "string" || typeof date === "object") date = new Date(date);

    return moment(date).format("YYYY-MM-DD");
};


/**
 * 格式化 koa-validator错误消息,并抛出
 */
export function throwValidatorError(errors: any) {
    if (!errors) return "";
    for (let error of errors) {
        for (let key in error) {
            throw { status: 403, errorCode: "300101", errorMsg: error[key] };
        }
    }
};

/**
 * 拼接buffer
 * @param bufferArr 需要拼接的buffer数组
 */
export function concatBuffer(bufferArr: Array<any>) {
    let args = bufferArr;

    let sumlen = 0;
    for (let i = 0; i < args.length; i++) {
        sumlen += args[i].length;
    }

    let buf = new Buffer(sumlen);
    let pos = 0;
    for (let i = 0; i < args.length; i++) {
        args[i].copy(buf, pos);
        pos += args[i].length;
    }

    return buf;
};

/**
 * 写buffer
 * @param length 新建buffer的字节长度
 * @param content buffer内容
 * @param padding 从第几位开始写
 */
export async function writeBuffer(length: number, content: any, padding: number) {
    let buf = new Buffer(length);
    buf.fill(0);
    buf.writeUInt32BE(content, padding);
    return buf;
}