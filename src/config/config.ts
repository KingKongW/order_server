import * as path from "path";

export const PORT: number = 7202;  // 端口

export const LOG_PATH: string = path.resolve(__dirname, "..", "logs/");

export const PAGE_SIZE = 20;

export const server: any = {
    level: "",
    db: {
        pwd: "123",
        user: "root",
        url: "user_center_db",
        name: "user_center",
        maxConnections: 2, // 最大连接
        minConnections: 1,  // 最小连接
        maxIdleTime: 30     // 连接超时
    }
};

export const cachedConfig = {
    host: "ota_memcached:11211",
    lifetime: 60 * 30 // 单位秒
};

// 不加入token验证的请求 match比较
export const withoutTokenValidationURL: any = [
    "/login", "/signOut", "/verificationCode"
];


export const memcachedPrefix: any = {
    projectPrefix: "UserCenter_",
    wrongNumSuffix: "_wrongNum",
    verificationCodeSuffix: "_verificationCode"
};


export const MAX_WRONG_NUM: number = 3;

export const VERIFICATION_CODE_TIME: number = 60 * 10; // 验证码有效期10分钟

export const WRONG_NUM_TIME: number = 60 * 60 * 24; // 错误次数记录的有效时长，1天