/*
 * @Author: toringo
 * @Date: 2017-11-15 14:44:38
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-11-17 15:31:53
 * setItem 设置缓存 day 代表缓存时间
 * getItem 获取缓存
 */


const localstorage = (function () {
    const def = 7;
    function setItem(key, value, day) {
        const date = new Date().getTime();
        const data = {
            [key]: value,
            expire: date + (day * 24 * 3600 || def * 24 * 3600),
        };
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    function getItem(key) {
        const data = window.localStorage.getItem(key);
        if (data) {
            if (JSON.parse(data).expire < new Date().getTime()) {
                window.localStorage.removeItem(key);
                return false;
            }
            return JSON.parse(data)[key];
        }
        window.localStorage.removeItem(key);
    }
    return {
        set: setItem,
        get: getItem,
    };
}());

export default localstorage;
