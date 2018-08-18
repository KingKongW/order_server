import * as router from "koa-router";
import * as order from "../model/business/order";
import { checkPageParams } from "../middlewares/page";

export = function (router: router) {
  router.get("/api/order", checkPageParams, getOrder);
  router.get("/api/confirm", confirmOrder);
  router.post("/api/upload", uploadOrders);
  router.post("/api/change", changeOrder);
  router.get("/api/over", completeOrder);
  // router.delete("/api/delete", deleteOrder);
  router.get("/api/cancel", cancelOrder);
  router.get("/api/finance/statistics", statisticsOrder);
  router.get("/api/finance/trend", trendOrder);
};



async function getOrder() {
  this.body = await order.getList(parseInt(this.query.pageIndex), parseInt(this.query.pageSize), this.query);
}

async function confirmOrder() {
  this.checkQuery("orderNumber").notEmpty("订单号不能为空！");
  await order.confirmOrder(this.query.orderNumber);
  return;
}

async function changeOrder() {
  let orders: any = this.request.body;
  for (let iterm of orders) {
    await order.changeOrder(iterm);
  }
  this.body = {};
}

async function uploadOrders() {
  let orders: any = this.request.body;
  for (let iterm of orders) {
    await order.uploadOrder(iterm);
  }

  this.body = {};
}

async function completeOrder() {
  this.checkQuery("orderNumber").notEmpty("订单号不能为空！");
  await order.completeOrder(this.query.orderNumber);
  return;
}

// async function deleteOrder() {
//   this.checkQuery("orderNumber").notEmpty("订单号不能为空！");
//   await order.deleteOrder(this.query.orderNumber);
//   return;
// }

async function cancelOrder() {
  this.checkQuery("orderNumber").notEmpty("订单号不能为空！");
  await order.cancelOrder(this.query.orderNumber);
  return;
}

async function statisticsOrder() {
  let body: any = await order.statisticsOrder();
  this.body = body;
  return;
}

async function trendOrder() {
  let body = await order.trendOrder(this.query.time, this.query.startTime, this.quey.endTime);
  this.body = body;
  return;
}
