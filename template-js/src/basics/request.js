import { normalize } from "./functions";
const __local = {
    jsonpIndex: 0,
};
/**
 * 根据短URL获取URL对象，短URL格式如下类似映射：
 *
 *  /a/b/c => http://example.com/a/b/c
 *  defautl@a/b/c => http://example.com/a/b/c
 *  alias@/a/b/c => http://alias.com/a/b/c
 *
 * 也支持完整URL:
 *  http://example.com/a/b/c => http://example.com/a/b/c
 *
 * 所有的映射全部配置在.env环境变量中，不同的环境各自配置，
 * 且配置项格式固定，统一大写 VITE_ORIGIN_${ALIAS}，如：
 *
 *  VITE_ORIGIN_DEFAULT="http://default.com"
 *    /a/b/c => http://default.com/a/b/c
 *
 *  VITE_ORIGIN_XUECHE="http://xueche.com"
 *    xueche@/a/b/c => http://xueche.com/a/b/c
 *
 * @param shortUrl
 * @param seperator
 * @returns
 */
export function getUrl(shortUrl, seperator = "@") {
    let url = shortUrl;
    if (!/^(https?\:)?\/\//.test(url)) {
        let alias = "default";
        let pathname = "";
        const parts = shortUrl.split(seperator);
        if (parts.length === 1) {
            pathname = normalize(parts[0]);
        }
        else {
            alias = parts[0].trim();
            parts.shift();
            pathname = normalize(parts.join(seperator));
        }
        let origin = import.meta.env[`VITE_ORIGIN_${alias.toUpperCase()}`];
        // 没有找到origin，则取当前页面的
        if (!origin) {
            origin = window.location.origin;
        }
        // 拼接路径到url中
        origin = origin.replace(/\/*$/, "");
        if (pathname) {
            url = origin + "/" + pathname;
        }
    }
    // 如果是正常的URL开头，直接返回
    if (/^https?\:/.test(url)) {
        return new URL(url);
    }
    // protocol 丢失补全
    if (url.startsWith("//")) {
        url = window.location.protocol + url;
    }
    else {
        url = window.location.protocol + "//" + url;
    }
    return new URL(url);
}
/**
 * 填充数据到目标对象
 * @param data
 * @param target
 */
export function fillPayload(target, data) {
    for (let key in data) {
        const value = data[key];
        if (value instanceof Blob) {
            if (target instanceof FormData) {
                target.append(key, value);
            }
            continue;
        }
        target.append(key, String(value));
    }
}
// 预定义的一些错误code
export class PredefinedError {
}
Object.defineProperty(PredefinedError, "NetworkError", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        code: -9000,
        message: "网络异常，请重试",
    }
});
Object.defineProperty(PredefinedError, "TimeoutError", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        code: -9001,
        message: "请求超时，请重试",
    }
});
/**
 * 通过fetch发送ajax请求
 * @param shortUrl 别名URL
 * @param data 数据
 * @param option 选项
 */
export async function request(shortUrl, data, option) {
    data = data ?? {};
    option = option ?? {};
    const url = getUrl(shortUrl);
    const method = (option.method ?? "GET").toUpperCase();
    const transmitParams = option.transmitParams ?? false;
    const bodyAsJson = option.bodyAsJson ?? false;
    const timeout = option.timeout ?? 30 * 1000;
    delete option.transmitParams;
    delete option.bodyAsJson;
    delete option.timeout;
    const config = {
        cache: "no-cache",
        ...option,
        method,
    };
    // 透传页面参数
    if (transmitParams) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.forEach((value, key) => {
            url.searchParams.append(key, value);
        });
    }
    if (method === "GET") {
        fillPayload(url.searchParams, data);
    }
    else if (method === "POST") {
        if (bodyAsJson) {
            config.body = JSON.stringify(data);
            config.headers = {
                ...(config.headers ?? {}),
                "Content-Type": "application/json",
            };
        }
        else {
            const hasFile = Object.values(data).some((item) => item instanceof Blob);
            if (hasFile) {
                config.body = new FormData();
            }
            else {
                config.body = new URLSearchParams();
            }
            fillPayload(config.body, data);
        }
    }
    return Promise.race([
        (async () => {
            try {
                const response = await fetch(url, config);
                const result = await response.json();
                return result;
            }
            catch (error) {
                return {
                    data: null,
                    ...PredefinedError.NetworkError,
                };
            }
        })(),
        new Promise((resolve) => {
            window.setTimeout(() => resolve({
                data: null,
                ...PredefinedError.TimeoutError,
            }), timeout);
        }),
    ]);
}
/**
 * 发送GET请求
 * @param shortUrl
 * @param data
 * @param option
 * @returns
 */
export async function get(shortUrl, data, option) {
    return request(shortUrl, data, { ...option, method: "GET" });
}
/**
 * 发送POST请求
 * @param shortUrl
 * @param data
 * @param option
 * @returns
 */
export async function post(shortUrl, data, option) {
    return request(shortUrl, data, { ...option, method: "POST" });
}
/**
 * 发送POST请求，请求体作为JSON字符串
 * @param shortUrl
 * @param data
 * @param option
 * @returns
 */
export async function json(shortUrl, data, option) {
    return request(shortUrl, data, {
        ...option,
        method: "POST",
        bodyAsJson: true,
    });
}
/**
 * 发送jsonp请求
 * @param shortUrl
 * @param callbackName 服务端将会返回执行的回调函数名称
 */
export async function jsonp(shortUrl, callbackName = "callback") {
    return new Promise((resolve, reject) => {
        // 生成全局唯一的
        __local.jsonpIndex += 1;
        const funcName = "jsonp_" + Date.now().toString(36) + "_" + __local.jsonpIndex;
        const url = getUrl(shortUrl);
        url.searchParams.set(callbackName, funcName);
        // 创建全局script
        const script = document.createElement("script");
        script.src = url.toString();
        document.body.appendChild(script);
        script.onerror = (error) => {
            reject(error);
        };
        // 创建全局函数
        window[funcName] = (result) => {
            resolve(result);
            // 删除全局函数
            delete window[funcName];
            // 删除临时脚本
            script.remove();
        };
    });
}
