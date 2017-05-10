export const success: any = {
    status: 200,
    errorMsg: ""
};

export function clientObjectEmpty(elementType: string) {
    return {
        status: 403,
        errorCode: "300101",
        errorMsg: "没有查到对应的" + elementType + "信息，请检查参数！"
    };
}

export function objectExsit(elementName: string) {
    return  {
        status: 403,
        errorMsg: "相同的" + elementName + "已存在！"
    };
};

export function objectNotExsitFn(elementName: string) {
    return {
        status: 403,
        errorMsg: elementName + "不存在！"
    };
};

export function canNotChange(elementName: string) {
    return {
        status: 403,
        errorMsg: elementName + "不可修改！"
    };
}

export function isWrong(elementName: string) {
    return {
        status: 403,
        errorMsg: elementName + "不正确！"
    };
}

export function isEmpty(elementName: string) {
    return {
        status: 403,
        errorMsg: elementName + "不可为空！"
    };
}

export function tokenHasGone() {
    return {
        status: 403,
        errorMsg: "登录已过期，请重新登录！"
    };
}

export function objectCantDel(elementName: string) {
    return {
        status: 403,
        errorMsg: elementName + "不能删除！"
    };
};
