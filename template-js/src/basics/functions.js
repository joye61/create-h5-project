// 用于控制作用的本地变量
const __local = {
    uniqidIndex: 0,
};
/**
 * 一些常用的简单环境判断
 * @param env
 * @returns
 */
export function is(env // 可触摸环境
) {
    const ua = window.navigator.userAgent;
    switch (env.toLowerCase()) {
        case "ios":
            return /iPhone|iPad/i.test(ua);
        case "android":
            return /Android/i.test(ua);
        case "wechat":
            return /MicroMessenger/i.test(ua);
        case "qq":
            return /QQ/i.test(ua);
        case "alipay":
            return /AlipayClient/i.test(ua);
        case "weibo":
            return /Weibo/i.test(ua);
        case "douyin":
            return /aweme/i.test(ua);
        case "touchable":
            return window.ontouchstart !== undefined;
        default:
            return false;
    }
}
/**
 * 生成全局唯一id，只在本次SESSION中有效
 * @returns
 */
export function uniqid() {
    __local.uniqidIndex += 1;
    return Date.now().toString(36) + __local.uniqidIndex.toString(36);
}
/**
 * 移除路径前后的反斜杠
 * @param pathname
 * @returns
 */
export function normalize(pathname) {
    return pathname.replace(/^\/*|\/*$/g, "");
}
/**
 * 等到下一帧
 * @returns
 */
export async function nextTick() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => resolve());
    });
}
/**
 * 等待固定时间，期间一直阻塞
 * @param duration 等待时长(毫秒)
 */
export async function sleep(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}
/**
 * 逐帧执行的工具函数，返回一个方法，调用该方法，停止执行
 * @param callback
 * @param interval
 */
export function tick(callback, interval) {
    // 执行状态，是否正在执行
    let isRunning;
    let frame;
    let frameId;
    // 设置了tick的间隔
    if (interval && typeof interval === "number") {
        let lastTick = Date.now();
        frame = () => {
            if (!isRunning) {
                return;
            }
            frameId = window.requestAnimationFrame(frame);
            const now = Date.now();
            // 每次间隔频率逻辑上保持一致，即使帧频不一致
            if (now - lastTick >= interval) {
                // 本次tick的时间为上次的时间加上频率间隔
                lastTick = lastTick + interval;
                callback();
            }
        };
    }
    // 没有设置tick的间隔
    else {
        frame = () => {
            if (!isRunning) {
                return;
            }
            frameId = window.requestAnimationFrame(frame);
            // 没有设置interval时，每帧都执行
            callback();
        };
    }
    // 开始执行
    isRunning = true;
    frameId = window.requestAnimationFrame(frame);
    // 返回一个可以立即停止的函数
    return () => {
        isRunning = false;
        window.cancelAnimationFrame(frameId);
    };
}
/**
 * 直接条件为真或者超时才返回结果
 *
 * @param condition 检测条件
 * @param maxTime 最大等待时长（毫秒）
 *
 * @returns 返回检测的结果，超时返回false
 */
export async function waitUntil(condition, maxTime) {
    // 记录检测开始时间
    const start = Date.now();
    // 如果检测条件不为函数，直接返回结果
    if (typeof condition !== "function") {
        return !!condition;
    }
    // 设置默认检测时间的最大值，如果没有设置，则一直检测
    if (!maxTime || typeof maxTime !== "number") {
        maxTime = Infinity;
    }
    return new Promise((resolve) => {
        const stop = tick(() => {
            const now = Date.now();
            const result = condition();
            // 超时返回false
            if (now - start >= maxTime) {
                stop();
                resolve(false);
                return;
            }
            // 处理结果
            const handle = (res) => {
                if (res) {
                    stop();
                    resolve(true);
                }
            };
            // 未超时状态
            if (result instanceof Promise) {
                result.then(handle);
                return;
            }
            // 普通一般的结果
            handle(result);
        });
    });
}
/**
 * 标准化长度值单位
 * @param value 长度值
 * @param defaultUnit 默认长度值单位 px
 */
export function normalizeCssUnit(value, defaultUnit = "px") {
    if (typeof value === "number") {
        return value + defaultUnit;
    }
    const CSSValueReg = /^((?:\-)?(?:\d+\.?|\.\d+|\d+\.\d+))([a-zA-Z%]*)$/;
    if (typeof value === "string") {
        const result = value.match(CSSValueReg);
        if (Array.isArray(result)) {
            return result[2]
                ? parseFloat(value) + result[2]
                : parseFloat(value) + defaultUnit;
        }
    }
    return value;
}
