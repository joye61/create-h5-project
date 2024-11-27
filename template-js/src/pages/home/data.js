/**
 * 如果 data.ts 文件有默认导出，则会调用默认导出作为数据初始化
 * 如果 data.ts 文件没有默认导出，则会调用 getPageData 函数作为数据初始化
 * 如果同时存在默认导出和 getPageData，优先执行默认导出
 */
export default async function () {
    console.log("默认导出函数被执行");
    await new Promise((resolve) => {
        window.setTimeout(resolve, 1000);
    });
}
export function getPageData() {
    console.log("非默认导出");
}
