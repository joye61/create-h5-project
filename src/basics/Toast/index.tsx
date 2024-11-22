import { createPortalElement } from "../dom";
import { Toast, Toastprops } from "./Toast";

/**
 * 显示一个Toast
 * @param content
 * @param option
 */
export function showToast(
  content: React.ReactNode,
  option?: Omit<React.PropsWithChildren<Toastprops>, "children" | "onHide">
) {
  option = option ?? {};
  const { mount, unmount } = createPortalElement();
  mount(
    <Toast {...option} onHide={() => unmount()}>
      {content}
    </Toast>
  );
}
