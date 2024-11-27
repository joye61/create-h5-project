import { createRoot } from "react-dom/client";
/**
 *
 * 组件可以通过函数的第一个参数传递进去
 *
 * @param point HTMLElement 挂载点，如果未指定，则挂载点为body
 * @returns CreatePortalDOMResult
 */
export function createPortalElement(point) {
    const container = document.createElement("div");
    let mountPoint = document.body;
    if (point instanceof HTMLElement) {
        mountPoint = point;
    }
    mountPoint.appendChild(container);
    const root = createRoot(container);
    return {
        element: container,
        mount(component) {
            root.render(component);
        },
        unmount() {
            root.unmount();
            if (container instanceof HTMLDivElement) {
                if (typeof container.remove === "function") {
                    container.remove();
                }
                else {
                    mountPoint.removeChild(container);
                }
            }
        },
    };
}
