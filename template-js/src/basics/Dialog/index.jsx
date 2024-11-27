import { createPortalElement } from "../dom";
import { Dialog } from "./Dialog";
export function showDialog(content, option) {
    const portal = createPortalElement();
    const onClose = () => portal.unmount();
    portal.mount(<Dialog {...option} onClose={onClose}>
      {content}
    </Dialog>);
    return () => {
        portal.mount(<Dialog open={false} {...option} onClose={onClose}>
        {content}
      </Dialog>);
    };
}
