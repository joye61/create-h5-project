import style from "./index.module.css";
import classNames from "classnames";
import { useEffect, useState } from "react";

export interface Toastprops extends React.HTMLProps<HTMLDivElement> {
  // toast出现的位置，上|中|下
  position?: "top" | "middle" | "bottom";
  // toast持续时间
  duration?: number;
  // toast消失动画时触发的回调
  onHide?: () => void;
}

export function Toast(props: React.PropsWithChildren<Toastprops>) {
  const {
    children,
    position = "middle",
    duration = 2000,
    className,
    onHide,
    ...extra
  } = props;

  const [open, setOpen] = useState<boolean>(true);

  const classes: string[] = [style.container];
  if (position === "top") {
    classes.push(style.top, open ? style.topShow : style.topHide);
  } else if (position === "middle") {
    classes.push(style.middle, open ? style.middleShow : style.middleHide);
  } else if (position === "bottom") {
    classes.push(style.bottom, open ? style.bottomShow : style.bottomHide);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration]);

  return (
    <div
      {...extra}
      className={classNames(classes, className)}
      onAnimationEnd={(event) => {
        if (
          [
            style.TopHideAnimation,
            style.MiddleHideAnimation,
            style.BottomHideAnimation,
          ].includes(event.animationName)
        ) {
          onHide?.();
        }
      }}
    >
      {children}
    </div>
  );
}
