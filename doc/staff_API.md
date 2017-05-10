# 《SecMonitorv1.0 - Web管理端通讯接口规范》 #

`create: 2017-05-08`

## 概述 ##
  公共定义请查看[api.md](api.md)

## 1 用户 ##

### 1.1 获取验证码   ###

- **url**  

   > `get`  /verificationCode

- **接口说明**  

  获取验证码

- **响应**

  返回验证码PNG文件


### 1.2 用户登录   ###


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


  ### 1.3 退出   ###

- **url**  

   > `post`  /signOut

- **接口说明**  

  退出系统，清除用户token。

- **响应header**

  `status: 401 , auth_id: null, auth_token: null`


### 1.4 修改密码   ###

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

  无


  ### 1.5 新增、编辑用户信息   ###

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

无



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

### 1.7 删除用户信息   ###

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

### 1.8 获得用户信息   ###

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



  ### 1.9 重置用户密码   ###

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


  ### 1.10 用户token检验   ###

- **url**  

   > `post`  /staff/token

- **接口说明**  

  验证用户token是否过期，需传入token值以及用户id。

- **body请求**

 参数名 | 类型 | 必须 | 描述
 :-----|:----:|:---:|:--------
 id | int | M | id
 token | string | M | token值

- **响应**

无