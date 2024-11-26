import { normalize } from "./functions";

declare const window: Window & {
  [key: string]: any;
};

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
 * 且配置项格式固定，统一大写 VITE_HOST_${ALIAS}，如：
 *
 *  VITE_HOST_DEFAULT="http://default.com"
 *    /a/b/c => http://default.com/a/b/c
 *
 *  VITE_HOST_XUECHE="http://xueche.com"
 *    xueche@/a/b/c => http://xueche.com/a/b/c
 *
 * @param shortUrl
 * @param seperator
 * @returns
 */
export function getUrl(shortUrl: string, seperator = "@"): URL {
  let url: string | undefined = shortUrl;
  if (!/^(https?\:)?\/\//.test(url)) {
    let alias = "default";
    let pathname = "";
    const parts = shortUrl.split(seperator);
    if (parts.length === 1) {
      pathname = normalize(parts[0]);
    } else {
      alias = parts[0].trim();
      parts.shift();
      pathname = normalize(parts.join(seperator));
    }

    url = import.meta.env[`VITE_HOST_${alias.toUpperCase()}`];

    // 没有找到host，则取当前页面的
    if (!url) {
      url = window.location.origin;
    }

    // 拼接路径到url中
    url = url.replace(/\/*$/, "");
    if (pathname) {
      url += "/" + pathname;
    }
  }

  // 如果配置的host以 // 开头，则用当前页面的protocol补全
  if (url.startsWith("//")) {
    url = window.location.protocol + url;
  }

  return new URL(url);
}

/**
 * 填充数据到目标对象
 * @param data
 * @param target
 */
export function fillPayload(target: URLSearchParams | FormData, data: Payload) {
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

// 载荷数据类型
export type Payload = Record<string, number | string | Blob>;

// 网络请求结果数据类型约定
export type Result<T = any> = {
  data: T;
  code: number;
  message: string;
};

// 预定义的一些错误code
export class PredefinedError {
  static NetworkError = {
    code: -9000,
    message: "网络异常，请重试",
  };
  static TimeoutError = {
    code: -9001,
    message: "请求超时，请重试",
  };
}

// 请求参数定义
export type RequestOption = Omit<RequestInit, "body"> & {
  // 透传当前页面的参数
  transmitParams?: boolean;
  // 将请求体作为JSON字符串发送
  bodyAsJson?: boolean;
  // 超时时间
  timeout?: number;
};

/**
 * 通过fetch发送ajax请求
 * @param shortUrl 别名URL
 * @param data 数据
 * @param option 选项
 */
export async function request<T = Result>(
  shortUrl: string,
  data?: Payload,
  option?: RequestOption
): Promise<T> {
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

  const config: RequestInit = {
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
  } else if (method === "POST") {
    if (bodyAsJson) {
      config.body = JSON.stringify(data);
      config.headers = {
        ...(config.headers ?? {}),
        "Content-Type": "application/json",
      };
    } else {
      const hasFile = Object.values(data).some((item) => item instanceof Blob);
      if (hasFile) {
        config.body = new FormData();
      } else {
        config.body = new URLSearchParams();
      }
      fillPayload(config.body, data);
    }
  }

  return Promise.race([
    (async () => {
      try {
        const response = await fetch(url, config);
        const result: T = await response.json();
        return result;
      } catch (error) {
        return {
          data: null,
          ...PredefinedError.NetworkError,
        } as T;
      }
    })(),
    new Promise<T>((resolve) => {
      window.setTimeout(
        () =>
          resolve({
            data: null,
            ...PredefinedError.TimeoutError,
          } as T),
        timeout
      );
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
export async function get<T = Result>(
  shortUrl: string,
  data?: Payload,
  option?: Omit<RequestOption, "method">
) {
  return request<T>(shortUrl, data, { ...option, method: "GET" });
}

/**
 * 发送POST请求
 * @param shortUrl
 * @param data
 * @param option
 * @returns
 */
export async function post<T = Result>(
  shortUrl: string,
  data?: Payload,
  option?: Omit<RequestOption, "method">
) {
  return request<T>(shortUrl, data, { ...option, method: "POST" });
}

/**
 * 发送POST请求，请求体作为JSON字符串
 * @param shortUrl
 * @param data
 * @param option
 * @returns
 */
export async function json<T = Result>(
  shortUrl: string,
  data?: Payload,
  option?: Omit<RequestOption, "method" | "bodyAsJson">
) {
  return request<T>(shortUrl, data, {
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
export async function jsonp<T = Result>(
  shortUrl: string,
  callbackName: string = "callback"
): Promise<T> {
  return new Promise((resolve, reject) => {
    // 生成全局唯一的
    __local.jsonpIndex += 1;
    const funcName =
      "jsonp_" + Date.now().toString(36) + "_" + __local.jsonpIndex;

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
    window[funcName] = (result: T) => {
      resolve(result);
      // 删除全局函数
      delete window[funcName];
      // 删除临时脚本
      script.remove();
    };
  });
}
