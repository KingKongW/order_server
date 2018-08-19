import Sequelize = require("sequelize");
import * as utils from "../../utils/utils";

export interface OrderInterface {
    id?: number;
    orderNumber: string;
    status: number;
    createTime: string;
    confirmTime?: string;
    completeTime?: string;
    cancelTime?: string;
    useTime?: string;
    source: number;
    quantity: number;
    eleTicketQuantity: number;
    entityTicketQuantity: number;
    externalOrderNumber: string;
    orderBelong: string;
    orderBelongId: number;
    goodsName: string;
    goodsCode?: string;
    supplier: string;
    incomingNumber: string;
    incomingTime: string;
    salesVolume: number;
    unitPrice: number;
    rmbCost: number;
    costCurrency: string;
    currencyExchangeRate: number;
    deliveryQuantity: number;
    deliveryCost: number;
    deliveryNumber?: string;
    commission: number;
    discount: number;
    profit: number;
    profitRate: number;
    netProfit: number;
    netProfitRate: number;
}

export interface Instance extends Sequelize.Instance<OrderInterface> { }

export interface OrderInterface extends Sequelize.Model<Instance, OrderInterface> {
    findByPage: (option: Object, pageIndex: number, pageSize: number) => Sequelize.Instance<Instance>;
}

export function define(sequelize: Sequelize.Sequelize): OrderInterface {
    let OrderModel: OrderInterface = <OrderInterface>sequelize.define<Instance, OrderInterface>("order", {
        "id": { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true }, // 订单主键
        "orderNumber": { type: Sequelize.STRING(50), allowNull: false },
        "status": { type: Sequelize.INTEGER(1), allowNull: false },
        "createTime": {
            type: Sequelize.DATE,
            get: function () {
                return utils.dateFormat(this.getDataValue("createTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "confirmTime": {
            type: Sequelize.DATE,
            get: function () {
                return utils.dateFormat(this.getDataValue("confirmTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "completeTime": {
            type: Sequelize.DATE,
            get: function () {
                return utils.dateFormat(this.getDataValue("completeTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "cancelTime": {
            type: Sequelize.DATE,
            get: function () {
                return utils.dateFormat(this.getDataValue("cancelTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "useTime": {
            type: Sequelize.DATE, get: function () {
                return utils.dateFormat(this.getDataValue("useTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "source": { type: Sequelize.INTEGER(11), allowNull: false },
        "quantity": { type: Sequelize.INTEGER(1), allowNull: false },
        "eleTicketQuantity": { type: Sequelize.INTEGER(11), allowNull: false },
        "entityTicketQuantity": { type: Sequelize.INTEGER(11), defaultValue: 0, allowNull: false },
        "externalOrderNumber": { type: Sequelize.STRING(50), allowNull: false },
        "orderBelong": { type: Sequelize.STRING(50), allowNull: false },
        "orderBelongId": { type: Sequelize.INTEGER(50), allowNull: false },
        "goodsName": { type: Sequelize.STRING(50), allowNull: false },
        "goodsCode": { type: Sequelize.STRING(50) },
        "supplier": { type: Sequelize.STRING(50), allowNull: false },
        "incomingNumber": { type: Sequelize.STRING(50), allowNull: false },
        "incomingTime": {
            type: Sequelize.DATE, allowNull: false,
            get: function () {
                return utils.dateFormat(this.getDataValue("createTime"), "YYYY-MM-DD HH:mm:ss");
            }
        },
        "salesVolume": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "unitPrice": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "rmbCost": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "costCurrency": { type: Sequelize.STRING(50), allowNull: false },
        "currencyExchangeRate": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "deliveryQuantity": { type: Sequelize.INTEGER(11), allowNull: false },
        "deliveryCost": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "deliveryNumber": { type: Sequelize.STRING(50) },
        "commission": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "discount": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "profit": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "profitRate": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "netProfit": { type: Sequelize.FLOAT(11, 2), allowNull: false },
        "netProfitRate": { type: Sequelize.FLOAT(11, 2), allowNull: false },
    },
        {
            tableName: "order"
        });
    return OrderModel;
};