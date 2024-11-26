# H5 开发模板

基于 `React + TypeScript + Vite` 开发 H5 项目的模板

## 开始

请使用 `src/basics` 导出的 `createApp` 调用创建项目，这个函数包装了**自适应**、**路由**、**样式重置**等初始化逻辑，且 `basics` 下的部分组件会依赖 `createApp` 提供的初始化

## 自适应

基于 `rem` 的自适应逻辑，默认设计尺寸是 750px，如果设计尺寸不一样初始化时需要传入设计尺寸。因为浏览器最小显示字体的原因，`<html>` 根字体默认扩大了 `100` 倍，例如某个元素假设设计稿是`45px`，那么对应的自适应尺寸为 `45rem/100` = `.45rem`

## 路由

使用 `src/basics` 导出的 `createApp` 创建的应用默认具备以 `src/pages` 文件夹之后的文件路径映射为路由的能力，假设网址为 `https://example.com`，举例：

- `src/pages/[entry]/index.tsx` => `https://example.com`
- `src/pages/path/to/name/index.tsx` => `https://example.com/path/to/name`

> 其中 `[entry]` 代表 `createApp` 的参数 `entry`，代表默认路由。如果没有指定，则默认为 `home`，文件路径为 `src/pages/home/index.tsx`

## 数据

与 `index.tsx` 相同文件夹下的 `data.tsx?` 文件会被认为是该页面对应的数据加载文件，此文件会在页面渲染之前被读取，约定如下：

- 如果 `data.tsx?` 文件有默认函数导出，则会调用默认导出作为页面数据初始化
- 如果 `data.tsx?` 文件没有默认函数导出，则会调用 `getPageData` 函数作为页面数据初始化
- 如果 `data.tsx?` 文件既没有默认函数导出，也没有 `getPageData` 函数，则什么都不做
- 如果 `data.tsx?` 文件同时存在默认导出和 `getPageData` 函数，则优先执行默认导出
