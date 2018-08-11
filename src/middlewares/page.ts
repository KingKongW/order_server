let errorLogger = require("../config/logger").errorLogger;
import * as http from "http";
import { PAGE_SIZE } from "../config/config";
import * as utils from "../utils/utils";

export async function checkPageParams(next: any) {
    this.checkQuery("pageSize").isInt("每页显示项目数目应为数字").ge(-1, "分页参数pageSize必须大于等于-1").neq(0, "分页参数pageSize不能等于0");
    this.checkQuery("pageIndex").isInt("页码应为数字");
    utils.throwValidatorError(this.errors);
    this.query.pageIndex = this.query.pageIndex ? this.query.pageIndex : 1;
    this.query.pageSize = this.query.pageSize ? this.query.pageSize : PAGE_SIZE;

    await next;
}