import Sequelize = require("sequelize");
import * as utils from "../../utils/utils";

let DataTypes = require("sequelize/lib/data-types");

export interface StaffInterface {
    id?: number;
    loginName?: string;
    password?: string;
    name?: string;
    sex?: number;
    contactTel?: string;
    email?: string;
    type?: number;
    isvalid?: number;
    token?: string;
    isChangePwd?: number;
}

export interface Instance extends Sequelize.Instance<StaffInterface> { }

export interface StaffInterface extends Sequelize.Model<Instance, StaffInterface> {
    findByPage: (option: Object, pageIndex: number, pageSize: number) => Sequelize.Instance<Instance>;
}

export function define(sequelize: Sequelize.Sequelize): StaffInterface {
    let StaffModel: StaffInterface = <StaffInterface>sequelize.define<Instance, StaffInterface>("staff", {
        "id": { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true }, // 工作人员ID
        "loginName": { type: Sequelize.STRING(50), allowNull: false }, // 登录名
        "password": { type: Sequelize.STRING(50), allowNull: false }, // 密码
        "name": { type: Sequelize.STRING(50), allowNull: false }, // 姓名
        "sex": { type: Sequelize.INTEGER(1), allowNull: false }, // 性别：0=男；1=女
        "contactTel": { type: Sequelize.STRING(50) }, // 联系电话
        "email": { type: Sequelize.STRING(50) }, // 电子邮件
        "type": { type: Sequelize.INTEGER(11), allowNull: false }, // 类型：1:超级管理员 2 操作员
        "isvalid": { type: Sequelize.INTEGER(1), allowNull: false }, // 是否有效 1:有效，0：无效
        "token": { type: Sequelize.STRING(50) }, // token
        "isChangePwd": { type: Sequelize.INTEGER(1), defaultValue: 0, allowNull: false } // 是否已经修改了密码，默认值0， 0: 未曾修改过，需要强制修改； 1: 已经修改过，不需要强制修改
    },
        {
            tableName: "staff"
        });
    return StaffModel;
};