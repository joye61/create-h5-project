import { createPortalElement } from "../dom";
import { Dialog, DialogProps } from "./Dialog";

export function showDialog(
  content: React.ReactNode,
  option?: Omit<DialogProps, "children" | "open" | "onClose">
) {
  const portal = createPortalElement();
  portal.mount(<Dialog {...option}>{content}</Dialog>);

  return () => {
    portal.mount(
      <Dialog
        open={false}
        {...option}
        onClose={() => {
          portal.unmount();
        }}
      >
        {content}
      </Dialog>
    );
  };
}
