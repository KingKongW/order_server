import * as errorMsg from "../../config/error_msg";
import * as db from "../../model/dao/db";

import * as _ from "lodash";
import * as Sequelize from "sequelize";
import * as moment from "moment";

export async function getList(pageIndex: number, pageSize: number, query: any) {
    let whereParams: any;
    if (!_.isEmpty(query.orderNumber)) {
        whereParams.orderNumber = { like: "%" + query.orderNumber + "%" };
    }

    if (!_.isEmpty(query.status)) {
        whereParams.status = query.status;
    }

    if (!_.isEmpty(query.source)) {
        whereParams.source = query.source;
    }

    let list = await db.Order.findByPage({ where: whereParams, order​​: "createTime DESC" }, pageIndex, pageSize);

    return list;
}

export async function uploadOrder(order: any) {
    if (!_.isEmpty(order)) {
        order.createTime = new Date();
    }
    await db.Order.create(order);
    return;
}

export async function changeOrder(params: any) {
    let order: any = await db.Order.findOne({ where: { orderNumber: params.orderNumber } });
    if (_.isEmpty(order)) {
        throw errorMsg.objectNotExsitFn("订单号");
    }

    params.createTime = new Date();
    await order.update(params, { where: { id: order.id } });
    return;
}

export async function confirmOrder(orderNumber: string) {
    let order: any = db.Order.findOne({ where: { orderNumber: orderNumber, status: 1 } });

    if (_.isEmpty(order)) {
        throw errorMsg.objectNotExsitFn("订单号");
    }

    order.status = 2;
    order.confirmTime = new Date();
    await order.save();
    return;
}

export async function completeOrder(orderNumber: string) {
    let order: any = db.Order.findOne({ where: { orderNumber: orderNumber, status: 2 } });

    if (_.isEmpty(order)) {
        throw errorMsg.objectNotExsitFn("订单号");
    }
    order.status = 3;
    order.completeTime = new Date();
    await order.save();
    return;
}

// export async function deleteOrder(orderNumber: string) {
//     let order: any = db.Order.findOne({ where: { orderNumber: orderNumber, status: 3 } });

//     if (_.isEmpty(order)) {
//         throw errorMsg.objectNotExsitFn("订单号");
//     }
//     order.status = 5;
//     order.deleteTime = new Date();
//     await order.save();
//     return;
// }

export async function cancelOrder(orderNumber: string) {
    let order: any = db.Order.findOne({ where: { orderNumber: orderNumber } });

    if (_.isEmpty(order)) {
        throw errorMsg.objectNotExsitFn("订单号");
    }
    if (order.status === 1 || order.status === 2) {
        order.status = 4;
        order.cancelOrder = new Date();
        await order.save();
        return;
    }
    throw errorMsg.isWrong("订单状态");
}

export async function statisticsOrder() {
    // "select to_days(max(createTime)) - to_days(min(createTime)) from `order`.`order` where status = 3;"
    // "select sum(salesVolume), sum(profit), sum(netProfit), count(*) as orders from `order`.`order` where status = 3;"
    let query: any = await db.Order.findAndCountAll({
        where: { status: 3 },
        attributes: [[Sequelize.fn("max", Sequelize.col("createTime")), "maxTime"],
        [Sequelize.fn("min", Sequelize.col("createTime")), "minTime"],
        [Sequelize.fn("sum", Sequelize.col("salesVolume")), "salesTotal"],
        [Sequelize.fn("sum", Sequelize.col("profit")), "profitTotal"],
        [Sequelize.fn("sum", Sequelize.col("netProfit")), "netProfitTotal"]]
    });
    let distributes: any = await db.Order.findAll({
        where: { status: 3 },
        attributes: ["source", [Sequelize.fn("count", Sequelize.col("source")), "countSource"]],
        group: "source"
    });
    let i: number = 0;
    for (let distribute of distributes) {
        query.rows[i + 1] = distribute;
        i++;
    }
    return query;
}

export async function trendOrder(time: string, startTime: string, endTime: string) {
    let whereOptions: any = {};
    whereOptions.status = 3;
    let timeOptions: string = "%Y-%m-%d";

    if (time === "year") {
        timeOptions = "%Y";
    }

    if (time === "month") {
        let thisYear = (new Date()).getFullYear();
        let startTime = new Date("1/1/" + thisYear);
        whereOptions.createTime = { $gte: startTime };
        timeOptions = "%Y-%m";
    }
    if (time === "week") {
        let lastMs: number = (new Date()).getTime() - 7 * 24 * 60 * 60 * 1000;
        let lastDate = new Date(lastMs);
        whereOptions.createTime = { $between: [lastDate, new Date()] };
    }
    if (time === "day") {
        let thisYear = (new Date()).getFullYear();
        let thisMonth: number = (new Date()).getMonth();
        let startTime = new Date(thisYear, thisMonth, 1);
        whereOptions.createTime = { $gte: startTime };
    }

    if (time === "range") {
        whereOptions.createTime = { $between: [startTime, endTime] };
    }
    let result: any = db.Order.findAll({
        where: whereOptions,
        attributes: [
            [Sequelize.fn("DATE_FORMAT", Sequelize.col("createTime"), timeOptions), "time"],
            [Sequelize.fn("sum", Sequelize.col("salesVolume")), "salesTotal"],
            [Sequelize.fn("sum", Sequelize.col("profit")), "profitTotal"],
            [Sequelize.fn("sum", Sequelize.col("netProfit")), "netProfitTotal"]],
        group: [Sequelize.col("time")]
    });
    return result;
}