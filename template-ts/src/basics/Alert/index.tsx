import { showDialog } from "../Dialog";
import { Alert, AlertProps } from "./Alert";

export function showAlert(
  content: React.ReactNode,
  option?: Omit<AlertProps, "content">
) {
  option = option ?? {};
  const { onCancel, onConfirm, ...extra } = option;
  const close = showDialog(
    <Alert
      content={content}
      {...extra}
      onCancel={() => {
        close();
        onCancel?.();
      }}
      onConfirm={() => {
        close();
        onConfirm?.();
      }}
    />,
    { maskClosable: false }
  );
}
