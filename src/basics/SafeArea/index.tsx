import style from "./index.module.css";
import classNames from "classnames";
import { useViewport } from "../hooks";

export interface SafeAreaProps extends React.HTMLProps<HTMLDivElement> {
  position: "top" | "bottom";
}

/**
 * 安全区空白占位块
 * @param props
 * @returns
 */
export function SafeArea(props: React.PropsWithChildren<SafeAreaProps>) {
  const { position = "bottomn", children, ...extra } = props;

  useViewport({ viewportFit: "cover" });

  const classes: string[] = [];
  if (position === "top") {
    classes.push(style.top);
  } else if (position === "bottom") {
    classes.push(style.bottom);
  }
  return (
    <div className={classNames(classes)} {...extra}>
      {children}
    </div>
  );
}
