import { useEffect, useRef } from "react";
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
