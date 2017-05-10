import * as Memcached from "memcached";
import { cachedConfig } from "../config/config";

let logger = require("../config/logger").memcachedLogger;

let memcached = new Memcached(cachedConfig.host);

export async function set(key: string, value: any, lifeTime?: number) {
    return new Promise(function (resolve, reject) {
        lifeTime = lifeTime || cachedConfig.lifetime;
        logger.debug("[memcached set]", key, value, lifeTime);
        memcached.set(key, value, lifeTime, function (err) {
            logger.debug("[memcached set complete]");
            if (err) {
                logger.debug("[memcached set complete]", err);
                reject(err);
            }
            else resolve();
        });
    });
};

export async function get(key: string) {
    return new Promise(function (resolve, reject) {
        logger.debug("[memcached get]", key);
        memcached.get(key, function (err, data) {
            logger.debug("[memcached get complete] key:%s, value:%s", key, data);
            if (err) {
                logger.debug("[memcached get complete]", err);
                reject(err);
            } else if (!key || !data) {
                resolve();
            } else {
                let val = data[key] || data;
                resolve(val);
            }
        });
    });
};

export async function del(key: string) {
    return new Promise(function (resolve, reject) {
        logger.debug("[memcached delete]", key);
        memcached.del(key, function (err, data) {
            if (err) {
                logger.debug("[memcached delete complete]", err);
            }
            resolve();
        });
    });
};