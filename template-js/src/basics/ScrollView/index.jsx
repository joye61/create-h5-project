import styles from "./index.module.css";
import { RowCenter } from "../Flex/Row";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { nextTick, normalizeCssUnit } from "../functions";
export function ScrollView(props) {
    const { children, height, reachTopThreshold = 50, onReachTop, reachBottomThreshold = 50, onReachBottom, loading = false, loadingContent, onScroll, className, style, ...extra } = props;
    // 容器样式
    let containerStyle = {};
    if (height) {
        containerStyle.height = normalizeCssUnit(height);
    }
    if (style && typeof style === "object") {
        containerStyle = { ...style, ...containerStyle };
    }
    // 滚动容器
    const containerRef = useRef(null);
    const wrapRef = useRef(null);
    // 当前滚动到顶部的距离
    const top = useRef(0);
    const onScrollCallback = (rawEvent) => {
        const box = containerRef.current;
        // 已经滚动的距离
        const scrollTop = box.scrollTop;
        // 滚动容器的包含滚动内容的高度
        const contentHeight = box.scrollHeight;
        // 滚动容器的视口高度
        const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
        // 加载指示的高度，如果加载指示不存在，则高度为0
        const loadingHeight = box.children.item(1)?.offsetHeight ?? 0;
        const maxScroll = contentHeight - containerHeight;
        // 生成滚动事件参数
        const event = {
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
        if (event.direction === "downward" &&
            scrollTop > maxScroll - reachBottomThreshold - loadingHeight) {
            onReachBottom?.(event);
        }
        // 更新scrollTop上次的值
        top.current = scrollTop;
    };
    // loading内容
    let showLoadingContent = null;
    if (loading) {
        showLoadingContent = loadingContent;
        if (!loadingContent) {
            showLoadingContent = (<RowCenter className={styles.loading}>加载中...</RowCenter>);
        }
    }
    // container是否有滚动条
    const [hasScrollBar, setHasScrollBar] = useState(false);
    useEffect(() => {
        const box = containerRef.current;
        setHasScrollBar(box.scrollHeight > box.clientHeight);
    });
    useEffect(() => {
        if (loading) {
            (async () => {
                await nextTick();
                const box = containerRef.current;
                const contentHeight = box.scrollHeight;
                const containerHeight = Math.min(box.clientHeight, box.offsetHeight);
                box.scrollTop = contentHeight - containerHeight;
            })();
        }
    }, [loading]);
    return (<div style={containerStyle} className={classNames(styles.container, className)} onScroll={onScrollCallback} ref={containerRef} {...extra}>
      <div ref={wrapRef}>{children}</div>
      {hasScrollBar && showLoadingContent}
    </div>);
}
