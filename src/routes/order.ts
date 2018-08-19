import * as router from "koa-router";
import * as order from "../model/business/order";
import { checkPageParams } from "../middlewares/page";

export = function (router: router) {
  router.get("/api/order", checkPageParams, getOrder);
  router.post("/api/order/confirm", confirmOrder);
  router.post("/api/order/upload", uploadOrders);
  router.get("/api/order/export", exportOrders);
  router.post("/api/order/change", changeOrder);
  router.post("/api/order/recover", recoverOrder);
  router.post("/api/order/cancel", cancelOrder);
  router.get("/api/finance/statistics", statisticsOrder);
  router.get("/api/finance/trend", trendOrder);
};



async function getOrder() {
  this.body = await order.getList(parseInt(this.query.pageIndex), parseInt(this.query.pageSize), this.query);
}

async function confirmOrder() {
  let orders: any = this.request.body;
  for (let iterm of orders.orders) {
    await order.confirmOrder(iterm);
  }
  this.body = {};
}

async function changeOrder() {
  let body: any = this.request.body;
  await order.changeOrder(body.order);
  this.body = {};
}

async function uploadOrders() {
  let orders: any = this.request.body;
  for (let iterm of orders.orders) {
    await order.uploadOrder(iterm);
  }

  this.body = {};
}

async function exportOrders() {
  let orders: any = await order.exportOrders(this.query​​);
  this.body = orders;
}

async function recoverOrder() {
  let orders: any = this.request.body;
  for (let iterm of orders.orders) {
    await order.recoverOrder(iterm);
  }

  this.body = {};
}

async function cancelOrder() {
  let orders: any = this.request.body;
  for (let iterm of orders.orders) {
    await order.cancelOrder(iterm);
  }

  this.body = {};
}

async function statisticsOrder() {
  let body: any = await order.statisticsOrder();
  this.body = body;
}

async function trendOrder() {
  let body = await order.trendOrder(this.query);
  this.body = body;
}
