import classNames from "classnames";
import styles from "./index.module.css";
import { normalizeCssUnit } from "../functions";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval, useWindowResize } from "../hooks";

export interface MarqueeProps extends React.HTMLProps<HTMLDivElement> {
  height?: number | string;
  // 滚动列表，一般出入一个文字数组
  items: React.ReactNode[];
  // 每一项都会执行的渲染函数，可选
  renderItem?: (item: React.ReactNode) => React.ReactNode;
  // 每一项切换时间间隔，默认3秒
  interval?: number;
}

/**
 * 需要为容器设置一个固定的高度
 * @param props
 * @returns
 */
export function Marquee(props: MarqueeProps) {
  const {
    height,
    items,
    renderItem,
    interval = 4000,
    className,
    style,
    ...extra
  } = props;

  let finalStyle: React.CSSProperties = {};
  if (height) {
    finalStyle.height = normalizeCssUnit(height);
  }
  if (style && typeof style === "object") {
    finalStyle = {
      ...style,
      ...finalStyle,
    };
  }

  const [content, setContent] = useState<React.ReactNode>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number>(0);
  const [realHeight, setRealHeight] = useState<number>(0);
  const [boxClass, setBoxClass] = useState<string>(styles.box);

  const updateContent = useCallback(() => {
    const container = containerRef.current;
    if (container && Array.isArray(items)) {
      const list = [...items, items[0]];
      const computeHeight = container.getBoundingClientRect().height;
      const result = list.map((item, index) => {
        let children: React.ReactNode = item;
        if (typeof renderItem === "function") {
          children = renderItem(item);
        }
        return (
          <div key={index} style={{ height: `${computeHeight}px` }}>
            {children}
          </div>
        );
      });
      setContent(result);
      setRealHeight(computeHeight);
    }
  }, [items]);

  useWindowResize(() => {
    updateContent();
  });

  useEffect(() => {
    updateContent();
  }, [updateContent]);

  useInterval(() => {
    if (!Array.isArray(items) || items.length <= 1) {
      return;
    }
    setCurrent(current + 1);
    setBoxClass(classNames(styles.box, styles.withTransiton));
  }, interval);

  return (
    <div
      {...extra}
      style={finalStyle}
      className={classNames(styles.container, className)}
      ref={containerRef}
    >
      <div
        className={boxClass}
        style={{
          transform: `translateY(${-current * realHeight}px)`,
        }}
        onTransitionEnd={() => {
          if (current === items.length) {
            setCurrent(0);
            setBoxClass(styles.box);
          }
        }}
      >
        {content}
      </div>
    </div>
  );
}
