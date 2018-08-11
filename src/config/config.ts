import * as path from "path";

export const PORT: number = 7202;  // 端口

export const LOG_PATH: string = path.resolve(__dirname, "..", "logs/");

export const PAGE_SIZE = 20;

export const server: any = {
    level: "",
    db: {
        pwd: "123",
        user: "root",
        // url: "order_db",
        url: "127.0.0.1",
        port: "254",
        name: "order",
        maxConnections: 2, // 最大连接
        minConnections: 1,  // 最小连接
        maxIdleTime: 30     // 连接超时
    }
};
