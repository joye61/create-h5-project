import { showDialog } from "../Dialog";
import { Alert } from "./Alert";
export function showAlert(content, option) {
    option = option ?? {};
    const { onCancel, onConfirm, ...extra } = option;
    const close = showDialog(<Alert content={content} {...extra} onCancel={() => {
            close();
            onCancel?.();
        }} onConfirm={() => {
            close();
            onConfirm?.();
        }}/>, { maskClosable: false });
}
