let app = require("./../../app");
let request = require("supertest").agent(app.listen());
import * as Memcached from "../../utils/memcached";

export async function post(url: string, params: any) {
    Memcached.set("staff_1_token", "test_staff_admin_token", 60 * 60 * 24 * 2);
    return await request.post(url).set("Cookie", "SecMonitor_id=1;SecMonitor_token=test_staff_admin_token").send(params);
}

export async function get(url: string) {
    Memcached.set("staff_1_token", "test_staff_admin_token", 60 * 60 * 24 * 2);
    return await request.get(url).set("Cookie", "SecMonitor_id=1;SecMonitor_token=test_staff_admin_token");
}

export async function del(url: string) {
    Memcached.set("staff_1_token", "test_staff_admin_token", 60 * 60 * 24 * 2);
    return await request.delete(url).set("Cookie", "SecMonitor_id=1;SecMonitor_token=test_staff_admin_token");
}