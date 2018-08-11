import * as db from "../../model/dao/db";

import * as _ from "lodash";
import * as Sequelize from "sequelize";



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

    let list = await db.Order.findByPage(<Sequelize.AnyWhereOptions>{ where: whereParams, order​​: "createTime DESC" }, pageIndex, pageSize);

    return list;
}
