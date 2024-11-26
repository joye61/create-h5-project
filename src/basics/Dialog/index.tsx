import { createPortalElement } from "../dom";
import { Dialog, DialogProps } from "./Dialog";

export function showDialog(
  content: React.ReactNode,
  option?: Omit<DialogProps, "children" | "open" | "onClose">
) {
  const portal = createPortalElement();
  const onClose = () => portal.unmount();
  portal.mount(
    <Dialog {...option} onClose={onClose}>
      {content}
    </Dialog>
  );

  return () => {
    portal.mount(
      <Dialog open={false} {...option} onClose={onClose}>
        {content}
      </Dialog>
    );
  };
}
