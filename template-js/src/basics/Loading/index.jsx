import { createPortalElement } from "../dom";
import { Loading } from "./Loading";
export function showLoading(message) {
    const portal = createPortalElement();
    portal.mount(<Loading message={message}/>);
    return () => portal.unmount();
}
