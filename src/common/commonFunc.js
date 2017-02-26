/**
 * Created by Dulingbo on 2017/2/23.
 *
 * Copyright (c) 2016-present Dulingbo,SefonSoft Company, Inc.
 * All rights reserved.
 *
 * Author infomation:
 * Email:dulingbo@sefonSoft.com
 * Company:Sefon Soft.ChengDu
 * file information(文件功能):
 */
export const clone = (obj) => {
    return _clone(obj);
}

/**
 * 克隆一个对象
 * @param obj 要克隆的对象
 * @return 克隆好的对象
 * */
const _clone = (obj) => {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0; i < obj.length; ++i) {
            copy[i] = _clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}