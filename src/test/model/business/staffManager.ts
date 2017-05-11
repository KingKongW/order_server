import * as Chai from "chai";
import * as Staff from "../../../model/business/staffManager";
import * as Memcached from "../../../utils/memcached";
import * as utils from "../../../utils/utils";


let staffList: any = [
    { "id": 2, "loginName": "tianjy", "name": "tianjy", "sex": 1, "contactTel": "s", "email": "e@12.com", "isvalid": 1 },
    { "id": 3, "loginName": "wangsy", "name": "wangsy", "sex": 1, "contactTel": "f", "email": "e", "isvalid": 1 }];



describe("Staff.getVerificationCode()", () => {
    it(" success: login", async () => {
        let result: any = await Staff.getVerificationCode("127.0.0.1");
        return;
    });
});

describe("Staff.login()", () => {
    it(" success: login", async () => {
        //设置验证码
        await Memcached.set("UserCenter_127.0.0.1_verificationCode", "test_staff_wangsy_token".toUpperCase(), 60 * 60 * 24 * 2);

        let result: any = await Staff.login({ account: "wangsy", password: utils.md5('123456'), verificationCode: "test_staff_wangsy_token",ip:"127.0.0.1" });
        Chai.expect(result).to.include.keys(["id", "name", "token", "isChangePwd"]);
        Chai.expect(result.id).to.eq(3);
        Chai.expect(result.name).to.eq("wangsy"); 
        Chai.expect(result.isChangePwd).to.eq(0);
        return;
    });
    let errorParams: any = [{
        body: { account: "abcd", password: "6c7268e9149bde37fd036ebf464b1545" ,ip:"127.0.0.1"},
        errorMsg: "用户名、密码不正确！",
        title: "the loginName is wrong"
    }, {
        body: { account: "wangsy", password: "abcddddddd" ,ip:"127.0.0.1"},
        errorMsg: "用户名、密码不正确！",
        title: "the password is wrong"
    }];

    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            try {
                await Staff.login(errorParam.body);
            } catch (error) {
                Chai.expect(error.status).to.eql(403);
                Chai.expect(error.errorMsg).to.eql(errorParam.errorMsg);
            }
        });
    }
});


describe("Staff.modifyPWD()", () => {
    let staffId = 3;

    it(" success: modifyPWD", async () => {
        let result: any = await Staff.modifyPWD(staffId, utils.md5("123456"), utils.md5("111111"));
        return;
    });

    it(" success: modifyPWD", async () => {
        let result: any = await Staff.modifyPWD(staffId, utils.md5("111111"), utils.md5("123456"));
        return;
    });

    let errorParams: any = [{
        body: { oldPwd: "abcd", newPwd: "6c7268e9149bde37fd036ebf464b1545", staffId: 0 },
        errorMsg: "用户不存在！",
        title: "the user is unExist"
    }, {
        body: { oldPwd: "abcd", newPwd: "6c7268e9149bde37fd036ebf464b1545", staffId: staffId },
        errorMsg: "旧密码不正确！",
        title: "the oldPwd is wrong"
    }];

    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            try {
                await Staff.modifyPWD(errorParam.body.staffId, errorParam.body.oldPwd, errorParam.body.newPwd);
            } catch (error) {
                Chai.expect(error.status).to.eql(403);
                Chai.expect(error.errorMsg).to.eql(errorParam.errorMsg);
            }
        });
    }
});


describe("Staff.saveStaff()", () => {
    let random = (new Date()).getTime();
    let id: number;
    let createParam = {
        loginName: "helloTestBusiness" + random,
        password: utils.md5("123456"),
        name: "create_bu",
        sex: 0,
        contactTel: "12333332222",
        email: "123@123.com",
        isvalid: 1
    };
    let updateParam = {
        id: id,
        loginName: "helloTestBusiness" + random,
        name: "update_bu",
        sex: 1,
        contactTel: "12333332222_update",
        email: "123@123.com",
        isvalid: 0
    };

    it(" success: create", async () => {
        let result: any = await Staff.saveStaff(createParam);
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result.loginName).to.eq(createParam.loginName);
        Chai.expect(result.name).to.eq(createParam.name);
        Chai.expect(result.sex).to.eq(createParam.sex);
        updateParam.id = id = result.id;
    });

    it(" success: update", async () => {
        let result: any = await Staff.saveStaff(updateParam);
        Chai.expect(result.loginName).to.eq(updateParam.loginName);
        Chai.expect(result.contactTel).to.eq(updateParam.contactTel);
        Chai.expect(result.name).to.eq(updateParam.name);
        Chai.expect(result.sex).to.eq(updateParam.sex);
        return;
    });

    let errorParams: any = [{
        body: createParam,
        errorMsg: "相同的登录名已存在！",
        title: "add a new user which is the same as previous"
    }, {
        body: {
            loginName: "fff" + random,
            id: 1,
            name: "test_update",
            sex: 1,
            contactTel: "12333332222_update",
            email: "123@123.com",
            isvalid: 0
        },
        errorMsg: "登录名不可修改！",
        title: "the loginName can't modify"
    }, {
        body: {
            id: "-1",
            sex: "1"
        },
        errorMsg: "用户不存在！",
        title: "the id is unexsit"
    }];

    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            try {
                await Staff.saveStaff(errorParam.body);
            } catch (error) {
                Chai.expect(error.status).to.eql(403);
                Chai.expect(error.errorMsg).to.eql(errorParam.errorMsg);
            }
        });
    }

    it(" success: delete the new user", async () => {
        let result: any = await Staff.deleteStaff(updateParam.id);
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result).to.eq(1);
        return;
    });
});


describe("Staff.deleteStaff()", () => {

    let random = (new Date()).getTime();
    let id: number;
    let createParam = {
        loginName: "hello_delete" + random,
        password: utils.md5("123456"),
        name: "delete_bu",
        sex: 0,
        contactTel: "12333332222",
        email: "123@123.com",
        isvalid: 1
    };

    it(" success: create", async () => {
        let result: any = await Staff.saveStaff(createParam);
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result.loginName).to.eq(createParam.loginName);
        Chai.expect(result.name).to.eq(createParam.name);
        Chai.expect(result.sex).to.eq(createParam.sex);
        id = result.id;
    });

    it(" success: delete the new user", async () => {
        let result: any = await Staff.deleteStaff(id);
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result).to.eq(1);
        return;
    });

    it(" failed: the id is unexist", async () => {
        try {
            await Staff.deleteStaff(-1);
        } catch (error) {
            Chai.expect(error.status).to.eql(403);
            Chai.expect(error.errorMsg).to.eql("用户不存在！");
        }
    });
});



describe("Staff.getStaffInfo()", () => {
    it(" success: getStaffInfo", async () => {
        let result: any = await Staff.getStaffInfo(staffList[0].id);
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result.loginName).to.eq(staffList[0].loginName);
        Chai.expect(result.name).to.eq(staffList[0].name);
        Chai.expect(result.sex).to.eq(staffList[0].sex);
    });

    it(" failed: the id is unexist", async () => {
        try {
            await Staff.getStaffInfo(-1);
        } catch (error) {
            Chai.expect(error.status).to.eql(403);
            Chai.expect(error.errorMsg).to.eql("用户不存在！");
        }
    });
});


describe("Staff.resetPassword()", () => {
    it(" success: reset user password", async () => {
        let result: any = await Staff.resetPassword(staffList[0].id, utils.md5("123456"));
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result.password).to.eq(utils.md5(staffList[0].loginName + utils.md5("123456")));
        return;
    });

    it(" success: reset user password again", async () => {
        let result: any = await Staff.resetPassword(staffList[0].id, utils.md5("111111"));
        result = JSON.parse(JSON.stringify(result));
        Chai.expect(result.password).to.eq(utils.md5(staffList[0].loginName + utils.md5("111111")));
        return;
    });

    let errorParams: any = [{
        id: -1,
        errorMsg: "用户不存在！",
        title: "the id is unexsit"
    }];

    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            try {
                await Staff.resetPassword(errorParam.id, errorParam.loginName);
            } catch (error) {
                Chai.expect(error.status).to.eql(403);
                Chai.expect(error.errorMsg).to.eql(errorParam.errorMsg);
            }
        });
    }
});


describe("Staff.checkToken()", () => {
    let token: string;

    it(" success: login", async () => {
        //设置验证码
        await Memcached.set("UserCenter_127.0.0.1_verificationCode", "test_staff_wangsy_token".toUpperCase(), 60 * 60 * 24 * 2);

        let result: any = await Staff.login({ account: "wangsy", password: utils.md5('123456'), verificationCode: "test_staff_wangsy_token" ,ip: "127.0.0.1"});
        Chai.expect(result).to.include.keys(["id", "name", "token", "isChangePwd"]);
        Chai.expect(result.id).to.eq(3);
        Chai.expect(result.name).to.eq("wangsy"); 
        Chai.expect(result.isChangePwd).to.eq(0);
        token = result.token;
        return;
    });

    it(" success: check token", async () => {
        let result: any = await Staff.checkToken(staffList[1].id, token);
        return;
    });
    let errorParams: any = [{
        body: { id: 0, token: token },
        errorMsg: "用户不存在！",
        title: "the id is unexsit"
    }, {
        body: { id: staffList[1].id, token: token },
        errorMsg: "token不正确！",
        title: "the token is wrong"
    }, {
        body: { id: staffList[0].id, token: token },
        errorMsg: "登录已过期，请重新登录！",
        title: "the user unLogin"
    }];

    for (let errorParam of errorParams) {
        it(" failed:  " + errorParam.title, async () => {
            try {
                await Staff.checkToken(errorParam.body.id, errorParam.body.token);
            } catch (error) {
                Chai.expect(error.status).to.eql(403);
                Chai.expect(error.errorMsg).to.eql(errorParam.errorMsg);
            }
        });
    }
});
