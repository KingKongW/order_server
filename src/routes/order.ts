import * as router from "koa-router";
import * as utils from "../utils/utils";
import * as staff from "../model/business/staffManager";
import { checkPageParams } from "../middlewares/page";

export = function (router: router) {
  router.get("/webclient/api/order", checkPageParams, getOrder);
};



async function getOrder() {
  this.body = await staff.getList(parseInt(this.query.pageIndex), parseInt(this.query.pageSize), this.query);
}
