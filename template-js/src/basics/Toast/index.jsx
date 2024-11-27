import { createPortalElement } from "../dom";
import { Toast } from "./Toast";
/**
 * 显示一个Toast
 * @param content
 * @param option
 */
export function showToast(content, option) {
    option = option ?? {};
    const { mount, unmount } = createPortalElement();
    mount(<Toast {...option} onHide={() => unmount()}>
      {content}
    </Toast>);
}
