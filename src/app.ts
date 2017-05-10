import * as koa from "koa";
const convert = require("koa-convert");
const koaBody = require("koa-body");
const koaLog = require("koa-logger");
const staticServer = require("koa-static");
const path = require("path");

import * as config from "./config/config";
import * as error from "./middlewares/error";

import routes = require("./routes/index");
import * as db from "./model/dao/db";

let app = new koa();
require("koa-validate")(app);
app.use(convert(koaLog()));
app.use(convert(koaBody({ multipart: true })));
app.use(convert(error.error({})));

db.initialize();
routes(app);

app.listen(config.PORT);
console.log("start this app, the port is " + config.PORT);

export = app;