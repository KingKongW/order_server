import * as Koa from "koa";
import * as Router from "koa-router";
const convert = require("koa-convert");
import { tokenValidation } from "../middlewares/validation";

let router = new Router();
 
import staffManager = require("./staffManager");


export = function (app: Koa) { 
    staffManager(router);


    // todo 暂时屏蔽token及权限验证
    // app.use(convert(tokenValidation({})));
    app.use(convert(router.routes())).use(convert(router.allowedMethods()));
};