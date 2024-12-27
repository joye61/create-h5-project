import { useCallback, useEffect, useState } from "react";
import { Container } from "./Container";
import { createRoot } from "react-dom/client";
import { nextTick, normalize } from "./functions";
import { setHistory, history } from "./history";
import { Skeleton } from "./Skeleton";
/**
 * 创建H5 APP，默认用<Container>包裹页面
 * @param option
 */
export function createApp(option) {
    option = option ?? {};
    const defaultConfig = {
        entry: "/home",
        target: "#root",
        mode: "history",
        renderLoading: false,
    };
    option = {
        ...defaultConfig,
        ...option,
    };
    // 确保history对象的正确性
    setHistory(option.mode);
    const modules = import.meta.glob([
        "@/pages/**/index.{js,jsx}",
        "@/pages/**/data.{js,jsx}",
    ]);
    const App = () => {
        const [page, setPage] = useState(null);
        /**
         * 准备页面：展示加载中、加载数据、加载页面
         */
        const preparePage = useCallback(async (pathname) => {
            let basepath = import.meta.env.BASE_URL ?? "";
            basepath = normalize(basepath);
            pathname = normalize(pathname);
            const show404 = async () => {
                // 流程走到这里还没有找到页面，则渲染404
                if (typeof option.render404 === "function") {
                    const result404 = await option.render404();
                    setPage(result404);
                }
                else {
                    setPage("页面不存在");
                }
            };
            // 页面路径必须带有基础前缀，如果没有，则非法路径，认为404
            if (pathname !== basepath && !pathname.startsWith(basepath + "/")) {
                await show404();
                return;
            }
            // 过滤掉基础前缀之后继续移除反斜杠
            pathname = pathname.substring(basepath.length);
            pathname = normalize(pathname);
            // 如果pathname为空，则显示默认路由
            if (!pathname) {
                pathname = normalize(option.entry);
            }
            // 渲染加载中页面
            setPage(null);
            if (typeof option.renderLoading === "boolean" && option.renderLoading) {
                setPage(<Skeleton />);
                await nextTick();
            }
            else if (typeof option.renderLoading === "function") {
                const loadingPage = await option.renderLoading();
                setPage(loadingPage);
                await nextTick();
            }
            // 加载页面的数据
            const dataLoader = modules[`/src/pages/${pathname}/data.js`] ??
                modules[`/src/pages/${pathname}/data.jsx`] ??
                null;
            if (typeof dataLoader === "function") {
                const result = await dataLoader();
                // 如果存在默认导出或存在名为getPageData的导出，则执行
                if (typeof result.default === "function") {
                    await result.default();
                }
                else if (typeof result.getPageData === "function") {
                    await result.getPageData();
                }
            }
            // 加载页面
            const pageLoader = modules[`/src/pages/${pathname}/index.js`] ??
                modules[`/src/pages/${pathname}/index.jsx`] ??
                null;
            if (typeof pageLoader === "function") {
                const result = await pageLoader();
                const render = async (page) => {
                    if (typeof option.renderPage === "function") {
                        page = await option.renderPage(page);
                    }
                    setPage(page);
                };
                // 首先检测是否有默认导出，如果有则采用
                if (result.default) {
                    render(<result.default />);
                    return;
                }
                // 没有默认的则加载任意第一个遇到的组件
                const keys = Object.keys(result);
                if (keys[0]) {
                    const LoadedPage = result[keys[0]];
                    render(<LoadedPage />);
                }
                return;
            }
            // 流程走到这里还没有找到页面，则渲染404
            await show404();
        }, []);
        useEffect(() => {
            history.listen(({ location }) => preparePage(location.pathname));
            preparePage(history.location.pathname);
        }, [preparePage]);
        return (<Container designWidth={option.designWidth} maxWidth={option.maxWidth} minWidth={option.minWidth}>
        {page}
      </Container>);
    };
    // 获取挂载对象
    let mount = null;
    if (typeof option.target === "string") {
        mount = document.querySelector(option.target);
    }
    else if (option.target instanceof HTMLElement) {
        mount = option.target;
    }
    else {
        throw new Error("未找到挂载点");
    }
    // 渲染页面
    const root = createRoot(mount);
    root.render(<App />);
}
