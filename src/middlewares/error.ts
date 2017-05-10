let errorLogger = require("../config/logger").errorLogger;
import * as http from "http";

export function error(opts: Object) {

    let env: string = process.env.NODE_ENV || "development";

    return function *error(next: Object) {
        try {
            yield next;
            if (404 === this.response.status && !this.response.body) this.throw(404);
        } catch (err) {
            this.status = err.status || 500;
            errorLogger.error(err);

            if ("development" === env) this.body = err;
            else if (err.expose) this.body = {errorMsg: err.errorMsg};
            else this.body = {errorMsg: http.STATUS_CODES[this.status]};
        }
    };
}