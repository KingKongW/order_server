import Sequelize = require("sequelize");
import * as config from "../../config/config";
export import StaffModel = require("./staff");



// Add any other models here

export let Staff: StaffModel.StaffInterface;


// Add any other models here

/**
 * to connect the database
 */
export function toConnect(): any {

    let dbOption = {
        host: config.server.db.url,
        port: config.server.db.port || 3306,
        timezone: "+08:00",
        dialect: "mysql",
        logging: true,
        pool: {
            max: config.server.db.maxConnections,
            min: config.server.db.minConnections,
            idle: config.server.db.maxIdleTime
        },
        define: {
            timestamps: false,
            freezeTableName: true,
            classMethods: {
                findByPage: async function () {
                    type page = { pageIndex: number, pageSize: number, totalCount: number, pageTotal: number, data: Object };
                    type options = { limit: number, offset: number, attributes: Array<string>, include: Array<any> };

                    let options: options = arguments[0];
                    let index: number = arguments[1];
                    let size: number = arguments[2];

                    if (isNaN(index) || index <= 0) index = 1;
                    let page: page = { pageIndex: index, pageSize: size, totalCount: 0, pageTotal: 0, data: {} };

                    if (page.pageSize > 0 && index > 0) {
                        options.limit = page.pageSize;
                        options.offset = (page.pageIndex - 1) * page.pageSize;
                    }

                    let data = await this.findAll(options);
                    page.data = data;

                    let count = 0;
                    delete options.attributes;
                    count = await this.count(options);

                    page.totalCount = count;
                    page.pageTotal = (page.pageSize !== 0) ? Math.ceil(count / page.pageSize) : count;

                    return page;
                }
            }
        }
    };

    return new Sequelize(config.server.db.name, config.server.db.user, config.server.db.pwd, dbOption);
};

/**
 * to init the model of database 
 */
export function initialize(): void {
    let sequelize = toConnect();


    Staff = <StaffModel.StaffInterface>StaffModel.define(sequelize);

};