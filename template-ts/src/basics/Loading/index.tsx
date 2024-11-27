import { createPortalElement } from "../dom";
import { Loading } from "./Loading";

export type CloseLoading = () => void;

export function showLoading(message?: string): CloseLoading {
  const portal = createPortalElement();
  portal.mount(<Loading message={message} />);
  return () => portal.unmount();
}
