import * as Koa from "koa";
import * as Router from "koa-router";
const convert = require("koa-convert");

let router = new Router();

import staffManager = require("./staffManager");


export = function (app: Koa) {
    staffManager(router);


    app.use(convert(router.routes())).use(convert(router.allowedMethods()));
};