import { useCallback, useEffect, useState } from "react";
import { Container, ContainerProps } from "./Container";
import { createRoot } from "react-dom/client";
import { nextTick, normalize } from "./functions";
import { setHistory, history } from "./history";
import { Skeleton } from "./Skeleton";

/**
 * createApp 参数
 */
export interface CreateAppOption extends ContainerProps {
  // 路由模式
  mode?: "history" | "hash" | "memory";
  // 入口页面
  entry?: string;
  // 挂载点
  target?: string | HTMLElement;
  // 渲染加载中的过渡页面，这个过程主要用来加载数据
  renderLoading?: (() => Promise<React.ReactNode> | React.ReactNode) | boolean;
  // 如果页面没找到，渲染404页面
  render404?: () => Promise<React.ReactNode> | React.ReactNode;
  // 渲染页面时可以进一步返回包裹组件
  renderPage?: (
    page: React.ReactNode
  ) => Promise<React.ReactNode> | React.ReactNode;
}

/**
 * 创建H5 APP，默认用<Container>包裹页面
 * @param option
 */
export function createApp(option?: CreateAppOption) {
  option = option ?? {};
  const defaultConfig: Partial<CreateAppOption> = {
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
    "@/pages/**/index.{ts,tsx}",
    "@/pages/**/data.{ts,tsx}",
  ]);

  const App: React.FC = () => {
    const [page, setPage] = useState<null | React.ReactNode>(null);

    /**
     * 准备页面：展示加载中、加载数据、加载页面
     */
    const preparePage = useCallback(async (pathname: string) => {
      let basepath = import.meta.env.BASE_URL ?? "";
      basepath = normalize(basepath);
      pathname = normalize(pathname);

      const show404 = async () => {
        // 流程走到这里还没有找到页面，则渲染404
        if (typeof option.render404 === "function") {
          const result404 = await option.render404();
          setPage(result404);
        } else {
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
        pathname = normalize(option.entry!);
      }

      // 渲染加载中页面
      setPage(null);
      if (typeof option.renderLoading === "boolean" && option.renderLoading) {
        setPage(<Skeleton />);
        await nextTick();
      } else if (typeof option.renderLoading === "function") {
        const loadingPage = await option.renderLoading();
        setPage(loadingPage);
        await nextTick();
      }

      // 加载页面的数据
      const dataLoader: any =
        modules[`/src/pages/${pathname}/data.ts`] ??
        modules[`/src/pages/${pathname}/data.tsx`] ??
        null;
      if (typeof dataLoader === "function") {
        const result = await dataLoader();
        // 如果存在默认导出或存在名为getPageData的导出，则执行
        if (typeof result.default === "function") {
          await result.default();
        } else if (typeof result.getPageData === "function") {
          await result.getPageData();
        }
      }

      // 加载页面
      const pageLoader: any =
        modules[`/src/pages/${pathname}/index.ts`] ??
        modules[`/src/pages/${pathname}/index.tsx`] ??
        null;

      if (typeof pageLoader === "function") {
        const result = await pageLoader();
        const render = async (page: React.ReactNode) => {
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

    return (
      <Container
        designWidth={option.designWidth}
        maxWidth={option.maxWidth}
        minWidth={option.minWidth}
      >
        {page}
      </Container>
    );
  };

  // 获取挂载对象
  let mount: HTMLElement | null = null;
  if (typeof option.target === "string") {
    mount = document.querySelector(option.target);
  } else if (option.target instanceof HTMLElement) {
    mount = option.target;
  } else {
    throw new Error("未找到挂载点");
  }

  // 渲染页面
  const root = createRoot(mount!);
  root.render(<App />);
}
