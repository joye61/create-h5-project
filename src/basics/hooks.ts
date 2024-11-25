import { useCallback, useEffect, useRef } from "react";
import { tick } from "./functions";

/**
 * 逐帧执行的ticker
 * @param frame 帧函数
 * @param interval 执行间隔
 */
export function useTick(frame: () => void) {
  const framer = useRef(frame);
  framer.current = frame;
  useEffect(() => {
    const stop = tick(() => framer.current());
    return () => stop();
  }, []);
}

/**
 * 间断执行的执行器
 * @param callback
 * @param delay
 */
export function useInterval(callback: Function, delay?: number | null) {
  const savedCallback = useRef<Function>(() => {});
  savedCallback.current = callback;

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(interval);
    }
  }, [delay]);
}

/**
 * 窗口尺寸变化时触发
 * @param onResize
 */
export function useWindowResize(onResize: () => void) {
  const resizeRef = useRef<() => void>(onResize);
  // 每次捕获最新的回调
  resizeRef.current = onResize;

  useEffect(() => {
    const callback = () => resizeRef.current();

    window.addEventListener("resize", callback);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", callback);
    } else if (window.onorientationchange) {
      window.addEventListener("orientationchange", callback);
    }

    return () => {
      window.removeEventListener("resize", callback);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener("change", callback);
      } else if (window.onorientationchange) {
        window.removeEventListener("orientationchange", callback);
      }
    };
  }, []);
}

export interface ViewportAttr {
  // 宽度
  width: "device-width" | number | string;
  // 高度
  height: "device-height" | number | string;
  // 最大缩放
  maximumScale: number;
  // 最小缩放
  minimumScale: number;
  // 是否可缩放
  userScalable: "yes" | "no";
  // 初始缩放比例
  initialScale: number;
  // 视口匹配
  viewportFit: "cover" | "contain" | "auto";
}

export function useViewport(attr?: Partial<ViewportAttr>) {
  let config: Partial<ViewportAttr> = {
    width: "device-width",
    initialScale: 1,
    userScalable: "no",
    viewportFit: "cover",
  };
  if (attr && typeof attr === "object") {
    config = { ...config, ...attr };
  }

  const parse = useCallback(
    (content: string): Record<string, string | number> => {
      content = content.replace(/\s+|,$/g, "");
      if (!content) return {};
      const parts = content.split(",");
      const output: Record<string, string> = {};
      for (let part of parts) {
        const arr = part.split("=");
        output[arr[0]] = arr[1];
      }
      return output;
    },
    []
  );

  const stringify = useCallback(
    (data: Record<string, string | number>): string => {
      const parts: string[] = [];
      for (let key in data) {
        const part = `${key}=${data[key]}`;
        parts.push(part);
      }
      return parts.join(", ");
    },
    []
  );

  useEffect(() => {
    // 确保viewport的合法逻辑
    let meta: HTMLMetaElement | null = document.querySelector(
      "meta[name='viewport']"
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.prepend(meta);
    }

    const content: Record<string, string | number> = parse(meta.content || "");
    if (config.width) {
      content.width = config.width;
    }
    if (config.height) {
      content.height = config.height;
    }
    if (config.maximumScale) {
      content["maximum-scale"] = config.maximumScale;
    }
    if (config.minimumScale) {
      content["minimum-scale"] = config.minimumScale;
    }
    if (config.initialScale) {
      content["initial-scale"] = config.initialScale;
    }
    if (config.userScalable) {
      content["user-scalable"] = config.userScalable;
    }
    if (config.viewportFit) {
      content["viewport-fit"] = config.viewportFit;
    }

    meta.content = stringify(content);
  }, [
    config.width,
    config.height,
    config.initialScale,
    config.maximumScale,
    config.minimumScale,
    config.userScalable,
    config.viewportFit,
    parse,
    stringify,
  ]);
}
