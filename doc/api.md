# 《SecMonitorv1.0 - Web管理端通讯接口规范》 #

`create: 2017-05-08`

## 概述 ##
  本规范定义Web前端页面与平台服务器通讯的交互API接口

  
- **网络协议**  
  HTTP，遵循RESTFul风格约定。

## 1.请求报文规范 ##

- **数据格式**  
  JSON格式，utf-8编码。

- **API请求根路径**

    文中所有api的url，需要在前面加上主机地址：
	`http://xxx.xxx.com/webclient/api`  


- **HEADER**

	参数名 | 类型 | 必须 | 描述
 	:------|:----:|:-------:|:--------
 	UserCenter_token | string | M | 用户token标识，登录后接口必须穿

- **body**  
  body内容为json文本
  
 
## 2.响应报文规范 ##


- **数据格式** 

    响应内容仍为JSON格式，采用utf-8编码。

- **HEADER** 

    响应内容的Header标识如下：

    `Content-Type:application/json;charset=utf-8`

- **HTTP方法** 

    一般使用 GET、POST、PUT、DELETE 这4个方法。



- **响应**

    依照HTTP协议的响应状态码作为判定标准：
    
     1） `HTTP STATUS=200`，为正确响应状态，按照接口定义返回正常报文内容。 
    
     2） `HTTP STATUS=4xx 或 5xx`，为异常响应状态，则根据返回报文体的错误信息处理。（4xx源于客户端的错误，5xx则源于服务器端的错误。）

     body内容为json文本时，需要通过SessionKey进行加密处理   
 
 *异常响应时，返回以下Error对象。*


   参数名 | 类型 | 必须 | 描述
 	:------|:----:|:-------:|:--------
 	errorCode | string | M | 错误代码。（平台自定义返回）
 	errorMsg | string | M | 错误信息。
 	requestId | string | M | 本次请求的Id标识，每次由服务端自动生成，出错时用于排查问题原因。


  *Sample:*

 ```json
	{
		"errorCode": 300104,
		"errorMsg": "您查询的数据记录为空。",
		"requestId": "57332ac66e0190fe9be73615ca6b"
	}  
 ```  



## 3. 业务接口说明 ##

![用户](staff_API.md) 