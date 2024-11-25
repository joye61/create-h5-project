import "./index.css";
import { useViewport, useWindowResize } from "../hooks";
import { useEffect, useRef, useState } from "react";

export interface ContainerProps {
  designWidth?: number;
  children?: React.ReactNode;
}

export function Container(props: ContainerProps) {
  const { designWidth = 750, children } = props;
  const [winWidth, setWinWidth] = useState<number>(window.innerWidth);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useViewport();

  useEffect(() => {
    styleRef.current = document.createElement("style");
    document.head.appendChild(styleRef.current);

    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, []);

  useWindowResize(() => {
    setWinWidth(window.innerWidth);
  });

  // 自适应逻辑核心
  useEffect(() => {
    const base = (winWidth * 100) / designWidth;

    const element = styleRef.current;
    if (element) {
      const rulesLen = element.sheet?.cssRules.length;
      if (rulesLen && rulesLen > 0) {
        for (let i = 0; i < rulesLen; i++) {
          element.sheet?.deleteRule(i);
        }
      }
      const rule = `html{font-size:${base}px}`;
      element.sheet?.insertRule(rule);
    }
  }, [winWidth, designWidth]);

  // 激活iOS上的:active伪类逻辑
  useEffect(() => {
    const activable = () => {};
    document.body.addEventListener("touchstart", activable);
    return () => {
      document.body.removeEventListener("touchstart", activable);
    };
  }, []);

  return children;
}
