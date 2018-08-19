import * as _ from "lodash";
import * as db from "../model/dao/db";
import { withoutRightValidationURL } from "../config/config";
import * as StaffManager from "../model/business//staffManager";


export function rightValidation(next: any) {
    return function* (next: any) {
        let notRightValidation: boolean = checkIsValidation(withoutRightValidationURL, this.url);

        if (notRightValidation) {
            let user: any = yield StaffManager​​.login(this.request.body);
            this.cookies.set(
                "userId",
                user.id,
                {
                    maxAge: 10 * 60 * 1000, // cookie有效时长
                    expires: (new Date()).getTime() + 24 * 60 * 60 * 1000,  // cookie失效时间
                    httpOnly: true,  // 是否只用于http请求中获取
                    overwrite: true  // 是否允许重写
                }
            );
            console.log(this.cookies);
            yield next;
        } else {
            let staff: any = yield StaffManager.getStaffInfo(this.cookies.get("userId"));
            let userId = this.cookies.get("userId");
            if (staff.id == userId) {
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
