import * as _ from "lodash";
import * as db from "../model/dao/db";
import { withoutTokenValidationURL, memcachedPrefix } from "../config/config";
import * as Memcached from "../utils/memcached";

export function tokenValidation(next: any) {
    return function* (next: any) {

        let notTokenValidation: boolean = checkIsValidation(withoutTokenValidationURL, this.url);

        if (notTokenValidation) {
            yield next;
        } else {
            let userId = this.cookies.get("auth_id");
            let token = this.cookies.get("auth_token");

            if (_.isEmpty(userId) || _.isEmpty(token)) this.throw(401);

            let tokenValue: any = yield Memcached.get(memcachedPrefix.projectPrefix + "staff_" + userId + "_token");

            if (!!tokenValue && token === tokenValue) {
                yield next;
            } else {
                this.throw(401);
            }
        }
    };
};


/**
 * 判断是否验证
 */
function checkIsValidation(checkType: Array<string>, _url: string) {
    let isValidation: boolean = false;

    if (!_.isEmpty(checkType)) {
        for (let i = 0; i < checkType.length; i++) {
            if (!!_url.match(checkType[i])) {
                isValidation = true;
                break;
            }
        }
    }
    return isValidation;
}
