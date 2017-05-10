import * as log4js from "log4js";
import * as config from "./config";
import * as fs from "fs";

if (!fs.existsSync(config.LOG_PATH)) fs.mkdir(config.LOG_PATH);

log4js.loadAppender("file");
const localConfig: log4js.IConfig = {
    appenders: [
        { type: "console" },
        {
            type: "dateFile",
            filename: config.LOG_PATH + "/error",
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: "error"
        },
        {
            type: "dateFile",
            filename: config.LOG_PATH + "/getIp",
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: "getIp"
        },
        {
            type: "dateFile",
            filename: config.LOG_PATH + "/console",
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: "console"
        },
        {
            type: "dateFile",
            filename: config.LOG_PATH + "/memcached",
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: "memcached"
        }
    ],
    levels: {
        "[all]": config.server.logLevel
    },
    replaceConsole: true
};

log4js.configure(localConfig);

export const dataLogger: log4js.Logger = log4js.getLogger("data");
export const errorLogger: log4js.Logger = log4js.getLogger("error");
export const getIpLogger: log4js.Logger = log4js.getLogger("getIp");
export const consoleLogger: log4js.Logger = log4js.getLogger("console");
export const memcachedLogger: log4js.Logger = log4js.getLogger("memcached");
