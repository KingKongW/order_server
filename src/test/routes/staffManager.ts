let app = require("./../../app");
let request = require("supertest").agent(app.listen());
import * as Memcached from "../../utils/memcached";
import { memcachedPrefix } from "../../config/config";
import * as utils from "../../utils/utils";
import * as Chai from "chai";

let id: number = 4;
let token: string;
let prefixUrlWeb = "/webclient/api";
let verificationCode = "UserCenter_staff_3_token";
let cookie: string = "";
let modelList: any = [
    { "id": 2, "loginName": "tianjy", "name": "tianjy", "sex": 1, "contactTel": "s", "email": "e@12.com", "isvalid": 1 },
    { "id": 3, "loginName": "wangsy", "name": "wangsy", "sex": 1, "contactTel": "f", "email": "e", "isvalid": 1 }];


describe("post /webclient/api/login", () => {
    it(" success: login", async () => {

        await Memcached.set("UserCenter_::ffff:127.0.0.1_verificationCode", verificationCode.toUpperCase(), 60 * 60 * 24 * 2);

        let res: any = await request.post(prefixUrlWeb + "/login").send({ account: "wangsy", password: utils.md5('123456'), verificationCode: verificationCode, ip: "127.0.0.1" });
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result).to.include.keys(["id", "name", "token", "isChangePwd"]);
        Chai.expect(result.id).to.eq(3);
        Chai.expect(result.name).to.eq("wangsy");
        Chai.expect(result.isChangePwd).to.eq(0);
        token = result.token;
        let cookiesToken: any = await Memcached.get(verificationCode);
        Chai.expect(cookiesToken).to.eq(token);
        return;
    });

    let errorParams: any = [{
        body: { password: "6c7268e9149bde37fd036ebf464b1545", verificationCode: verificationCode, ip: "127.0.0.1" },
        errorMsg: "登录名不能为空！",
        title: "the loginName is empty"
    }, {
        body: { account: "wangsy", verificationCode: verificationCode, ip: "127.0.0.1" },
        errorMsg: "登录密码不能为空！",
        title: "the password is empty"
    }, {
        body: { account: "wangsy", password: "6c7268e9149bde37fd036ebf464b1545", verificationCode: verificationCode },
        errorMsg: "ip不能为空！",
        title: "the ip is empty"
    }, {
        body: { account: "abcd", password: "6c7268e9149bde37fd036ebf464b1545", verificationCode: verificationCode, ip: "127.0.0.1" },
        errorMsg: "用户名、密码不正确！",
        title: "the loginName is wrong"
    }, {
        body: { account: "wangsy", password: "abcddddddd", verificationCode: verificationCode, ip: "127.0.0.1" },
        errorMsg: "用户名、密码不正确！",
        title: "the password is wrong"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.post(prefixUrlWeb + "/login").send(errorParam.body);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});


describe("post /webclient/api/signOut", () => {
    let id: number;
    it(" success: login", async () => {

        await Memcached.set("UserCenter_::ffff:127.0.0.1_verificationCode", verificationCode.toUpperCase(), 60 * 60 * 24 * 2);

        let res: any = await request.post(prefixUrlWeb + "/login").send({ account: "wangsy", password: utils.md5('123456'), verificationCode: verificationCode,ip:"127.0.0.1" });
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result).to.include.keys(["id", "name", "token", "isChangePwd"]);
        Chai.expect(result.id).to.eq(3);
        Chai.expect(result.name).to.eq("wangsy");
        Chai.expect(result.isChangePwd).to.eq(0);
        token = result.token;
        let cookiesToken: any = await Memcached.get(verificationCode);
        Chai.expect(cookiesToken).to.eq(token);
        id = result.id;
        return;
    });

    let errorParams: any = [{
        body: { id: "" },
        errorMsg: "用户ID不能为空！",
        title: "the id is empty"
    }, {
        body: { id: "sdfsdf" },
        errorMsg: "用户ID值错误！",
        title: "the id is string"
    }, {
        body: { id: "0" },
        errorMsg: "用户ID值错误！",
        title: "the id is less than 1"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.post(prefixUrlWeb + "/signOut")
                .send(errorParam.body);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }

    it(" success: signOut", async () => {
        let res: any = await request.post(prefixUrlWeb + "/signOut").send({ id: id });
        Chai.expect(res.status).to.eql(401);
        return;
    });


});


describe("post /webclient/api/modifyPWD", () => {

    it(" success: modifyPWD", async () => {
        let res: any = await request.post(prefixUrlWeb + "/modifyPWD")
            .send({ id: modelList[0].id, oldPwd: utils.md5('111111'), newPwd: utils.md5('123456') });
        Chai.expect(res.status).to.eql(200);
        return;
    });

    it(" success: modifyPWD", async () => {
        let res: any = await request.post(prefixUrlWeb + "/modifyPWD")
            .send({ id: modelList[0].id, oldPwd: utils.md5('123456'), newPwd: utils.md5('111111') });
        Chai.expect(res.status).to.eql(200);
        return;
    });

    let errorParams: any = [{
        body: { id: "", oldPwd: "333", newPwd: utils.md5('123456') },
        errorMsg: "用户ID不能为空！",
        title: "the id is empty"
    }, {
        body: { id: "sdfsdf", oldPwd: "", newPwd: utils.md5('123456') },
        errorMsg: "用户ID值错误！",
        title: "the id is string"
    }, {
        body: { id: "0", oldPwd: "", newPwd: utils.md5('123456') },
        errorMsg: "用户ID值错误！",
        title: "the id is less than 1"
    }, {
        body: { id: "999", oldPwd: "", newPwd: utils.md5('123456') },
        errorMsg: "旧密码不能为空！",
        title: "the oldPwd is empty"
    }, {
        body: { id: "999", oldPwd: utils.md5('111111'), newPwd: "" },
        errorMsg: "新密码不能为空！",
        title: "the newPwd is empty"
    }, {
        body: { id: "999", oldPwd: utils.md5('111111'), newPwd: utils.md5('111111') },
        errorMsg: "新旧密码不能相同！",
        title: "the newPwd equals newPwd "
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.post(prefixUrlWeb + "/modifyPWD")
                .send(errorParam.body);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});

describe(" post /webclient/api/staff", () => {


    let random = (new Date()).getTime();
    let id: number;
    let createParam = {
        loginName: "hello" + random,
        password: utils.md5("123456"),
        name: "test_add",
        sex: 0,
        contactTel: "12333332222",
        email: "123@123.com",
        isvalid: 1
    };
    let updateParam = {
        id: id,
        loginName: "hello" + random,
        name: "test_update",
        sex: 1,
        contactTel: "12333332222_update",
        email: "123@123.com",
        isvalid: 0
    };
    it(" success: create", async () => {
        let res = await request.post(prefixUrlWeb + "/staff").send(createParam);
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        return;
    });

    it(" success: find the new staff", async () => {
        let res = await request.get(prefixUrlWeb + "/staff?pageIndex=-1&pageSize=20&keywords=" + random);
        let result = res.body.data[res.body.data.length - 1];
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result.loginName).to.eq(createParam.loginName);
        Chai.expect(result.contactTel).to.eq(createParam.contactTel);
        Chai.expect(result.name).to.eq(createParam.name);
        Chai.expect(result.sex).to.eq(createParam.sex);
        updateParam.id = id = result.id;
        return;
    });

    it(" success: update", async () => {
        let res = await request.post(prefixUrlWeb + "/staff").send(updateParam);
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
    });

    it(" success: find the new staff", async () => {
        let res = await request.get(prefixUrlWeb + "/staff?pageIndex=-1&pageSize=20&keywords=" + random);
        let result = res.body.data[res.body.data.length - 1];
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result.loginName).to.eq(updateParam.loginName);
        Chai.expect(result.contactTel).to.eq(updateParam.contactTel);
        Chai.expect(result.name).to.eq(updateParam.name);
        Chai.expect(result.sex).to.eq(updateParam.sex);
        updateParam.id = id = result.id;
        return;
    });

    it(" success: delete the new staff", async () => {
        let res = await request.delete(prefixUrlWeb + "/staff/" + updateParam.id);
        Chai.expect(res.status).to.eql(200);
        return;
    });

    let errorParams: any = [{
        body: { id: 1, loginName: "abc", name: "test", sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "登录名不可修改！",
        title: "loginName can not be changed"
    }, {
        body: { name: "test", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "登录名不能为空！",
        title: "the loginName is empty"
    }, {
        body: { loginName: "abc", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "姓名不能为空！",
        title: "the name is empty "
    }, {
        body: { name: "test", loginName: "abc", sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "密码不能为空！",
        title: "the password is empty "
    }, {
        body: { name: "test", loginName: "abc", password: utils.md5("111111"), ontactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "性别不能为空！",
        title: "the sex is empty "
    }, {
        body: { name: "test", loginName: "abc", password: utils.md5("111111"), sex: "2222", contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "性别参数不正确！",
        title: "the sex is wrong value"
    }, {
        body: { name: "test", loginName: "abc", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com" },
        errorMsg: "是否启用不能为空！",
        title: "the isvalid is empty"
    }, {
        body: { name: "test", loginName: "abc", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: "22" },
        errorMsg: "是否启用参数不正确！",
        title: "the isvalid is wrong value"
    }, {
        body: { id: "999999", name: "test", loginName: "abc", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "用户不存在！",
        title: "wrong id"
    }, {
        body: { name: "tianjy", loginName: "tianjy", password: utils.md5("111111"), sex: 0, contactTel: "12333332222", email: "123@123.com", isvalid: 1 },
        errorMsg: "相同的登录名已存在！",
        title: "loginName is exist"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.post(prefixUrlWeb + "/staff").send(errorParam.body);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});

describe(" delete /webclient/api/staff/:id", () => {

    let random = (new Date()).getTime();
    let id: number;
    let createParam = {
        loginName: "helloTestBusiness" + random,
        password: utils.md5("123456"),
        name: "test",
        sex: 0,
        contactTel: "12333332222",
        email: "123@123.com",
        isvalid: 1
    };
    it(" success: create", async () => {
        let res = await request.post(prefixUrlWeb + "/staff").send(createParam);
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        return;
    });

    it(" success: find the new staff", async () => {
        let res = await request.get(prefixUrlWeb + "/staff?pageIndex=-1&pageSize=20&keywords=" + random);
        let result = res.body.data[res.body.data.length - 1];
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result.loginName).to.eq(createParam.loginName);
        Chai.expect(result.contactTel).to.eq(createParam.contactTel);
        Chai.expect(result.name).to.eq(createParam.name);
        Chai.expect(result.sex).to.eq(createParam.sex);
        id = result.id;
        return;
    });


    it(" success: delete the new staff", async () => {
        let res = await request.delete(prefixUrlWeb + "/staff/" + id);
        Chai.expect(res.status).to.eql(200);
        return;
    });

    let errorParams: any = [{
        body: { id: "sdf" },
        errorMsg: "用户ID值错误！",
        title: "the type of id is string"
    }, {
        body: { id: 0 },
        errorMsg: "用户ID值错误！",
        title: "the id  is less than 1"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.delete(prefixUrlWeb + "/staff/" + errorParam.body.id);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});

describe(" get /webclient/api/staff/:id", () => {

    it(" success: get a staff info", async () => {
        let res = await request.get(prefixUrlWeb + "/staff/" + modelList[0].id);
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        Chai.expect(result.loginName).to.eq(modelList[0].loginName);
        Chai.expect(result.contactTel).to.eq(modelList[0].contactTel);
        Chai.expect(result.name).to.eq(modelList[0].name);
        Chai.expect(result.sex).to.eq(modelList[0].sex);
        return;
    });

    let errorParams: any = [{
        body: { id: "sdf" },
        errorMsg: "用户ID值错误！",
        title: "the type of id is string"
    }, {
        body: { id: 0 },
        errorMsg: "用户ID值错误！",
        title: "the id  is less than 1"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.get(prefixUrlWeb + "/staff/" + errorParam.body.id);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});



describe(" post /webclient/api/staff/resetPwd", () => {

    it(" success: resetPwd", async () => {
        let res = await request.post(prefixUrlWeb + "/staff/resetPwd").send({ id: modelList[0].id, password: utils.md5("111111") });
        let result = res.body;
        Chai.expect(res.status).to.eql(200);
        return;
    });

    let errorParams: any = [{
        body: {
            password: utils.md5("111111")
        },
        errorMsg: "用户ID不能为空！",
        title: "id is empty"
    }, {
        body: {
            id: id
        },
        errorMsg: "密码不能为空！",
        title: "the password is empty"
    }, {
        body: {
            id: "aaa",
            password: utils.md5("111111")
        },
        errorMsg: "用户ID值错误！",
        title: "the id is wrong "
    }, {
        body: {
            id: 778899,
            password: utils.md5("111111")
        },
        errorMsg: "用户不存在！",
        title: "the id is not exist"
    }];
    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            let res = await request.post(prefixUrlWeb + "/staff/resetPwd").send(errorParam.body);
            let result = res.body;
            Chai.expect(res.status).to.eql(403);
            Chai.expect(res.body.errorMsg).to.eql(errorParam.errorMsg);
        });
    }
});