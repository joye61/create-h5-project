import styles from "./index.module.css";
import { RowCenter } from "../Flex/Row";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { nextTick, normalizeCssUnit } from "../functions";

// 经过特别计算的滚动事件参数
export interface ScrollEvent {
  containerHeight: number;
  contentHeight: number;
  scrollTop: number;
  maxScroll: number;
  direction: "upward" | "downward";
  rawEvent?: React.UIEvent;
}

export interface ScrollViewProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "onScroll"> {
  // 滚动的内容
  children?: React.ReactNode;
  // 容器的高度，默认100%
  height?: React.CSSProperties["height"];
  // 触顶事件的阈值，默认为50像素
  reachTopThreshold?: number;
  // 触顶事件
  onReachTop?: (event: ScrollEvent) => void;
  // 触底事件发生的阈值，默认为50像素
  reachBottomThreshold?: number;
  // 触底事件
  onReachBottom?: (event: ScrollEvent) => void;
  // 是否显示loading
  loading?: boolean;
  // loading内容
  loadingContent?: React.ReactNode;
  // 滚动事件
  onScroll?: (event: ScrollEvent) => void;
}

export function ScrollView(props: ScrollViewProps) {
  const {
    children,
    height,
    reachTopThreshold = 50,
    onReachTop,
    reachBottomThreshold = 50,
    onReachBottom,
    loading = false,
    loadingContent,
    onScroll,
    className,
    style,
    ...extra
  } = props;

  // 容器样式
  let containerStyle: React.CSSProperties = {};
  if (height) {
    containerStyle.height = normalizeCssUnit(height);
  }
  if (style && typeof style === "object") {
    containerStyle = { ...style, ...containerStyle };
  }

  // 滚动容器
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 当前滚动到顶部的距离
  const top = useRef<number>(0);

  const onScrollCallback = (rawEvent: React.UIEvent<HTMLDivElement>) => {
    const box = containerRef.current!;
    // 已经滚动的距离
    const scrollTop = box.scrollTop;
    // 滚动容器的包含滚动内容的高度
    const contentHeight = box.scrollHeight;
    // 滚动容器的视口高度
    const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
    // 加载指示的高度，如果加载指示不存在，则高度为0
    const loadingHeight =
      (box.children.item(1) as HTMLElement)?.offsetHeight ?? 0;
    const maxScroll = contentHeight - containerHeight;

    // 生成滚动事件参数
    const event: ScrollEvent = {
      containerHeight,
      contentHeight,
      maxScroll,
      scrollTop,
      direction: scrollTop > top.current ? "downward" : "upward",
      rawEvent,
    };

    // 调用输入的滚动事件
    onScroll?.(event);

    // 判断是否触发触顶事件
    if (event.direction === "upward" && scrollTop < reachTopThreshold) {
      onReachTop?.(event);
    }

    // 判断是否触发触底事件
    if (
      event.direction === "downward" &&
      scrollTop > maxScroll - reachBottomThreshold - loadingHeight
    ) {
      onReachBottom?.(event);
    }

    // 更新scrollTop上次的值
    top.current = scrollTop;
  };

  // loading内容
  let showLoadingContent: React.ReactNode = null;
  if (loading) {
    showLoadingContent = loadingContent;
    if (!loadingContent) {
      showLoadingContent = (
        <RowCenter className={styles.loading}>加载中...</RowCenter>
      );
    }
  }

  // container是否有滚动条
  const [hasScrollBar, setHasScrollBar] = useState(false);

  useEffect(() => {
    const box = containerRef.current!;
    setHasScrollBar(box.scrollHeight > box.clientHeight);
  });

  useEffect(() => {
    if (loading) {
      (async () => {
        await nextTick();
        const box = containerRef.current!;
        const contentHeight = box.scrollHeight;
        const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
        box.scrollTop = contentHeight - containerHeight;
      })();
    }
  }, [loading]);

  return (
    <div
      style={containerStyle}
      className={classNames(styles.container, className)}
      onScroll={onScrollCallback}
      ref={containerRef}
      {...extra}
    >
      <div ref={wrapRef}>{children}</div>
      {hasScrollBar && showLoadingContent}
    </div>
  );
}
