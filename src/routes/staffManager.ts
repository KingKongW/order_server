import * as router from "koa-router";
import * as utils from "../utils/utils";
import * as staff from "../model/business/staffManager";
import { checkPageParams } from "../middlewares/page";

export = function (router: router) {
  router.post("/webclient/api/login", login);
  router.post("/webclient/api/signOut", signOut);
  router.post("/webclient/api/modifyPWD", modifyPWD);
  router.post("/webclient/api/staff", saveStaff);
  router.get("/webclient/api/staff", checkPageParams, getStaff);
  router.delete("/webclient/api/staff/:id", deleteStaff);
  router.get("/webclient/api/staff/:id", getStaffInfo);
  router.post("/webclient/api/staff/resetPwd", resetPassword);
};



/**
 * ### 1.2 用户登录   ###


- **url**  

   > `post`  /login

- **接口说明**  

  通过登录名、密码登录系统，登录后如果isChangePwd为0则强制修改密码。

- **body请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 account | string | M | 登录名
 password | string | M | 密码

- **响应对象**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | M |  id
 name | string | M |  用户名
 token | string | M | token
 sysRight | int | M |  用户拥有的权限
 type | int | M |  类型（1:系统管理员，2:其他管理员）
 isChangePwd | int | M |  是否已经修改过密码（0:未曾修改过，需强制修改；1:已经修改过，无需强制修改）

 */
async function login() {
  this.checkBody("account").notEmpty("登录名不能为空！");
  this.checkBody("password").notEmpty("登录密码不能为空！");
  this.checkBody("ip").notEmpty("ip不能为空！");
  utils.throwValidatorError(this.errors);
  this.body = await staff.login(this.request.body);
}

/**
 *  ### 1.3 退出   ###

- **url**  

   > `post`  /signOut

- **接口说明**  

  退出系统，清除用户token。

- **响应header**

  `status: 401 
 */
async function signOut() {
  let body = this.request.body;
  this.checkBody("id").notEmpty("用户ID不能为空！").isInt("用户ID值错误！", { min: 1 });
  utils.throwValidatorError(this.errors);
  this.body = await staff.signOut(body.id);
};



/**
 * ### 1.4 修改密码   ###

- **url**  

   > `post`  /modifyPWD

- **接口说明**  

  修改本人登录密码。

- **body请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 oldPwd | string | M | 旧密码
 newPwd | string | M | 新密码

- **响应**

  成功返回: `{ status: "success" }`
 */
async function modifyPWD() {
  let body = this.request.body;
  this.checkBody("id").notEmpty("用户ID不能为空！").isInt("用户ID值错误！", { min: 1 });
  this.checkBody("oldPwd").notEmpty("旧密码不能为空！");
  this.checkBody("newPwd").notEmpty("新密码不能为空！").neq(body.oldPwd, "新旧密码不能相同！");
  utils.throwValidatorError(this.errors);

  await staff.modifyPWD(body.id, body.oldPwd, body.newPwd);
  this.body = {};
}


/**
 * ### 1.5 新增、编辑用户信息   ###

- **url**  

   > `post`  /staff

- **接口说明**  

  新增、编辑用户信息，未传入id时为新增用户信息；传入id时为编辑此id的用户信息，其中登录名不可修改。
  新增用户时，密码由管理员录入（2次，1次输入，1次确认）。

- **body请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | O | id
 loginName | string | M |  登录名（无论是否传id都必传，但传id时要校验是否发生了修改，登录名不可修改）
 name | string | M |  用户名
 password | string | O |  登录密码（仅新增时传该参数，传id时不传该参数）
 sex | int | M |  性别（1：男，0: 女）
 contactTel | int | M |  联系电话
 email | string | M |  email
 isvalid | int | M |  是否启用

- **响应**

  {}
 */
async function saveStaff() {
  let body = this.request.body;
  this.checkBody("loginName").notEmpty("登录名不能为空！");
  this.checkBody("name").notEmpty("姓名不能为空！");
  this.checkBody("sex").notEmpty("性别不能为空！").isInt("性别参数不正确！", { min: 0, max: 1 });
  this.checkBody("isvalid").notEmpty("是否启用不能为空！").isInt("是否启用参数不正确！", { min: 0, max: 1 });
  if (!body.id) this.checkBody("password").notEmpty("密码不能为空！");

  utils.throwValidatorError(this.errors);

  await staff.saveStaff(body);
  this.body = {}

}



/**
 ### 1.6 获取用户信息列表   ###

- **url**  

   > `get`  /staff?pageIndex=&pageSize=&keywords=

- **接口说明**  

  获取用户列表

- **url请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 pageIndex | int | M | 当前页数（默认为1）
 pageSize | int | M | 每页显示条数（默认为20）
 keywords | string | O |  查询关键字

- **响应data对象**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id  | int | M | id.
 name | string | M |  用户名
 loginName | string | M |  登录名
 sex | int | M | 性别（1：男，0: 女）
 contactTel | int | M |  联系电话
 email | string | M |  email
 type | int | M |  类型（1:系统管理员，2:其他管理员）
 isvalid | int | M |  是否启用
 */
async function getStaff() {
  this.body = await staff.getList(parseInt(this.query.pageIndex), parseInt(this.query.pageSize), this.query.keywords);
}

/**
 * ### 1.7 删除用户信息   ###

- **url**  

   > `delete`  /staff/{id}

- **接口说明**  

  删除用户信息。

- **url请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | M | id

- **响应**

无

 */
async function deleteStaff() {
  this.checkParams("id").notEmpty("用户ID不能为空！").isInt("用户ID值错误！", { min: 1 });
  utils.throwValidatorError(this.errors);
  await staff.deleteStaff(this.params.id);
  this.body = {};
};


/**
 * ### 1.8 获得用户信息   ###

- **url**  

   > `get`  /staff/{id}

- **接口说明**  

  获得用户信息

- **url请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | M | id

- **响应**

  参数名 | 类型 | 必须 | 描述
  :-----|:----:|:---:|:--------
  id  | int | M | id.
  name | string | M |  用户名
  loginName | string | M |  登录名
  sex | int | M | 性别（1：男，0: 女）
  contactTel | int | M |  联系电话
  email | string | M |  email
  type | int | M |  类型（1:系统管理员，2:其他管理员）
  isvalid | int | M |  是否启用（0:否，1:是）
 */
async function getStaffInfo() {
  this.checkParams("id").notEmpty("用户ID不能为空！").isInt("用户ID值错误！", { min: 1 });
  utils.throwValidatorError(this.errors);
  this.body = await staff.getStaffInfo(this.params.id);
};


/**
 * ### 1.9 重置用户密码   ###

- **url**  

   > `post`  /staff/resetPwd

- **接口说明**  

  系统管理员重置用户密码，需传入新的密码以及用户id。

- **body请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | M | id
 password | string | M | 重置后的密码

- **响应**

无
 */
async function resetPassword() {
  let body = this.request.body;
  this.checkBody("password").notEmpty("密码不能为空！");
  this.checkBody("id").notEmpty("用户ID不能为空！").isInt("用户ID值错误！", { min: 1 });
  utils.throwValidatorError(this.errors);
  await staff.resetPassword(body.id, body.password)
  this.body = {};
};
