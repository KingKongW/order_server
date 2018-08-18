import * as errorMsg from "../../config/error_msg";
import * as db from "../../model/dao/db";

import * as _ from "lodash";
import { md5 } from "../../utils/crypto";

/**
 * 分页查询系统用户信息
 * @param pageIndex
 * @param pageSize
 * @param keywords 按登录名、姓名模糊查询
 */


export async function getList(pageIndex: number, pageSize: number, keywords: string) {
    let whereParams: any = [{ loginName: { $ne: "admin" } }];
    if (keywords) whereParams.push({ $or: [{ loginName: { $like: "%" + keywords + "%" } }, { userName: { $like: "%" + keywords + "%" } }] });
    let list = await db.Staff.findByPage({
        attributes: ["id", "loginName", "userName", "sex", "contactTel", "email", "isvalid"],
        where: whereParams,
    }, pageIndex, pageSize);

    return list;
}

/**
 * 新增、编辑角色
 * @param staffParams 新增、编辑用户对象
 */
export async function saveStaff(staffParams: any) {
    let staff: any;
    if (!staffParams.id) {
        // 新增
        let hasStaff = await db.Staff.findOne({ where: { loginName: staffParams.loginName } });
        if (!_.isEmpty(hasStaff)) throw errorMsg.objectExsit("登录名");
        let createParams = {
            loginName: staffParams.loginName,
            password: md5(staffParams.loginName + staffParams.password),
            userName: staffParams.userName,
            sex: staffParams.sex,
            contactTel: staffParams.contactTel,
            email: staffParams.email,
            type: (staffParams.loginName === "admin") ? 1 : 2,
            isvalid: staffParams.isvalid,
            isChangePwd: 0
        };
        staff = await db.Staff.create(<db.StaffModel.StaffInterface>createParams);

    } else {
        // 编辑
        if (staffParams.password) delete staffParams.password;
        staff = await db.Staff.findOne({ where: { id: staffParams.id } });
        if (_.isEmpty(staff)) throw errorMsg.objectNotExsitFn("用户");
        if (staffParams.loginName !== staff.loginName) throw errorMsg.canNotChange("登录名");

        staff.update(staffParams);
    }
    return staff;
};

/**
 * 重置密码
 * @param staffId 用户ID
 * @param password 重置后的密码
 */
export async function resetPassword(staffId: number, password: string) {
    let staff: any = await db.Staff.findById(staffId);
    if (_.isEmpty(staff)) throw errorMsg.objectNotExsitFn("用户");
    staff.password = md5(staff.loginName + password);
    staff.isChangePwd = 1;
    await staff.save();
    return staff;
};

/**
 * 删除系统用户
 * @param staffId 用户ID
 */
export async function deleteStaff(staffId: number) {
    let staff: any = await db.Staff.findById(staffId);
    if (_.isEmpty(staff)) throw errorMsg.objectNotExsitFn("用户");
    let queryParams: any = {
        where: {
            id: staffId
        },
        hooks: true
    };

    return await db.Staff.destroy(queryParams);
};

/**
 * 登录
 * @param loginParams 登录信息
 */
export async function login(loginParams: any) {
    let user: any = await db.Staff.findOne({
        where: {
            loginName: loginParams.account,
            password: md5(loginParams.account + loginParams.password)
        }
    });
    if (_.isEmpty(user)) {
        throw { status: 403, errorMsg: "用户名、密码不正确！"};
    }

    return { userName: user.userName, id: user.id, isChangePwd: user.isChangePwd, type: user.type };
}

/**
 * 退出登录
 */
export async function signOut(staffId: number) {
    throw { status: 401 };
}

/**
* 修改密码
* */
export async function modifyPWD(staffId: number, oldPwd: string, newPwd: string) {
    let staff: any = await db.Staff.findById(staffId);
    if (_.isEmpty(staff)) throw errorMsg.objectNotExsitFn("用户");
    if (md5(staff.loginName + oldPwd) !== staff.password) throw errorMsg.isWrong("旧密码");

    let value: any = {
        password: md5(staff.loginName + newPwd)
    };
    return await db.Staff.update(value, { where: { id: staffId } });
}


let ccap = require("ccap")({

    width: 128, // set width,default is 256

    height: 60, // set height,default is 60

    offset: 30, // set text spacing,default is 40

    generate: function () {// Custom the function to generate captcha text

        let text = Math.random().toString(36).substr(2).substring(0, 4).toUpperCase(); // generate captcha text here

        return text; // return the captcha text

    }
});


/**
 * 获得用户信息
 * @param id
 */
export async function getStaffInfo(id: number) {
    let staff: any = await db.Staff.findById(id);
    if (_.isEmpty(staff)) throw errorMsg.objectNotExsitFn("用户");
    delete staff.dataValues.password;
    return staff;
}
