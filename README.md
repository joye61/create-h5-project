# 通过模板创建 H5 项目

本模板基于 `React` 和 `Vite`，内置了一些 H5 项目常用功能和组件，且默认实现了**自适应**、**页面路由**、**样式重置**等每个 H5 项目都会设置的一些常用功能。你可以根据自己需求，任意修改内置逻辑，虽然大部分时候不需要做定制修改

## 开始

```bash
# 创建一个JS模板
npm create h5-template [你的项目名]

# 创建一个TS模板
npm create h5-template [你的项目名] --useTs
```

## 初始化

请使用 `src/basics/app.{jsx,tsx}` 导出的 `createApp` 函数调用作为入口逻辑创建项目，此函数包装了**自适应**、**路由**、**样式重置**等逻辑，且 `src/basics` 下的部分功能和组件依赖 `createApp` 提供的初始化逻辑

```ts
/**
 * 参数说明，可以不传任何参数，因为所有参数都是可选的
 */
interface CreateAppOption {
  // 设计稿尺寸，默认750px，如果设计尺寸跟750不一致，则需要手动设置
  designWidth?: number;
  // 最大文档展示宽度，默认576
  maxWidth?: number;
  // 最小文档展示宽度，默认312
  minWidth?: number;
  // 路由模式，默认为 history
  mode?: "history" | "hash" | "memory";
  // 入口页，默认为 src/pages/home/index.{jsx,tsx}
  entry?: string;
  // 挂载点，默认为 #root 元素
  target?: string | HTMLElement;
  /**
   * 渲染加载中的过渡页面，这个过程主要用来显示加载数据的过渡页面
   * - 如果设置为布尔值 true, 则加载页面会显示默认的 Skeleton 组件
   * - 如果设置为一个函数，则必须返回一个组件，该组件的返回值作为加载页面显示
   * - 如果未设置或false，则加载数据时会显示空白，这是默认值
   */
  renderLoading?: (() => Promise<React.ReactNode> | React.ReactNode) | boolean;
  /**
   * 如果页面没找到，渲染的404页面
   * - 这是一个函数，返回值代表404页面要显示的值
   * - 如果未设置，页面没找到时会显示“页面不存在”纯文本
   */
  render404?: () => Promise<React.ReactNode> | React.ReactNode;
  /**
   * 渲染页面时可以进一步返回包裹页面的组件
   * - 如果未设置，则直接返回找到的页面
   * - 如果设置，则必须返回一个组件作为页面
   * - 该函数唯一参数代表找到的页面
   */
  renderPage?: (
    page: React.ReactNode
  ) => Promise<React.ReactNode> | React.ReactNode;
}

/**
 * 入口函数签名，option 参数如果不传，则所有参数使用默认值
 */
createApp(option?: CreateAppOption): void;


// 例子：
createApp();
createApp({
  designWidth: 375,
  renderLoading: true
});
```

## 自适应

`create-h5-project` 设置了基于 `rem` 的自适应逻辑，默认设计尺寸 `750px`，如果实际设计尺寸和默认不一致则需要传入设计尺寸。由于浏览器最小显示字体的原因，`<html>` 根字体默认扩大了 `100` 倍，例如某个 `div` 元素宽度设计尺寸是`45px`，那么对应的宽度自适应尺寸为 `45rem/100` = `0.45rem`，这个换算很容易通过心算实现，小数点前移两位就行：

```css
div {
  width: 0.45rem;
}
```

## 页面路由

`create-h5-project` 采用基于本地文件路径的路由，类似 `next.js` 的路由方式，不过更简单：

- 约定 `src/pages/` 目录作为根路径
- 每个页面为一个根路径下的文件夹，文件夹的名字代表路径，文件夹可以嵌套
- 每个页面对应的文件夹下必须有一个 `index.{jsx,tsx}` 文件，作为页面组价显示
- 默认页面通过 `entry` 参数指定，如果未指定，则默认为 `home`

如以下对应关系：

- `src/pages/[entry]/index.{jsx,tsx}` 对应路径 `/`
- `src/pages/path/to/name/index.{jsx,tsx}` 对应路径 `/path/to/name`

假设 `Origin` 为 `https://example.com`，上述映射关系为：

- `src/pages/[entry]/index.{jsx,tsx}` => `https://example.com`
- `src/pages/path/to/name/index.{jsx,tsx}` => `https://example.com/path/to/name`

> 其中 `[entry]` 代表 `createApp` 的参数 `entry`，默认为 `home`，文件路径为 `src/pages/home/index.tsx`

## 数据加载

与 `index.{jsx,tsx}` 相同文件夹下的 `data.{js,ts,jsx,tsx}` 文件会被认为是该页面对应的数据加载文件，此文件会在页面渲染之前被读取，约定如下：

- 如果 `data.{js,ts,jsx,tsx}` 文件有默认函数导出，则会调用默认导出作为页面数据初始化
- 如果 `data.{js,ts,jsx,tsx}` 文件没有默认函数导出，则会调用 `getPageData` 函数作为页面数据初始化
- 如果 `data.{js,ts,jsx,tsx}` 文件既没有默认函数导出，也没有 `getPageData` 函数，则什么都不做
- 如果 `data.{js,ts,jsx,tsx}` 文件同时存在默认导出和 `getPageData` 函数，则优先执行默认导出

## CSS Reset

CSS 预置来自项目 [https://github.com/elad2412/the-new-css-reset](https://github.com/elad2412/the-new-css-reset)
