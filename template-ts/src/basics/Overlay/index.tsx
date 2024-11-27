import style from "./index.module.css";
import classNames from "classnames";

export interface OverlayProps extends React.HTMLProps<HTMLDivElement> {
  // 是否半透明
  translucent?: boolean;
}

export function Overlay(props: React.PropsWithChildren<OverlayProps>) {
  const { children, translucent = true, className, ...extra } = props;

  return (
    <div
      {...extra}
      className={classNames(
        style.container,
        translucent && style.translucent,
        className
      )}
    >
      {children}
    </div>
  );
}
