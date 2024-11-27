import { createBrowserHistory, createHashHistory, createMemoryHistory, } from "history";
// 默认的初始化history对象
let __mode = import.meta.env.VITE_HISTORY_MODE ?? "history";
export let history = createHistory(__mode);
/**
 * 创建历史对象实例
 * @param mode
 * @returns
 */
export function createHistory(mode = "history") {
    if (mode === "hash") {
        return createHashHistory();
    }
    else if (mode === "memory") {
        return createMemoryHistory();
    }
    else {
        return createBrowserHistory();
    }
}
/**
 * 更新history对象
 * @param mode
 */
export function setHistory(mode = "history") {
    if (__mode !== mode) {
        history = createHistory(mode);
    }
}
/**
 * 页面跳转逻辑，可以携带参数
 * @param pathname
 * @param data
 * @param type
 * @returns
 */
export function goto(pathname, data, type = "push") {
    if (/^(https?\:)?\/\//.test(pathname)) {
        window.location.href = pathname;
        return;
    }
    data = data ?? {};
    const search = new URLSearchParams(data).toString();
    if (search) {
        pathname = pathname.replace(/\&*$/g, "");
        if (/\?/.test(pathname)) {
            pathname += "&" + search;
        }
        else {
            pathname += "?" + search;
        }
    }
    history[type](pathname);
}
/**
 * 页面返回逻辑，默认返回上一页
 * @param n
 */
export function back(n = -1) {
    history.go(n);
}
