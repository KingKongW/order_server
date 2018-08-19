import * as Koa from "koa";
import * as Router from "koa-router";
const convert = require("koa-convert");
import { rightValidation } from "../middlewares/validation";

let router = new Router();

import staffManager = require("./staffManager");
import order = require("./order");

export = function (app: Koa) {
    staffManager(router);
    order(router);

    app.use(convert(rightValidation({})));
    app.use(convert(router.routes())).use(convert(router.allowedMethods()));
};