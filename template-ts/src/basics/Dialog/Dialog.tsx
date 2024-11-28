import style from "./Dialog.module.css";
import { Overlay } from "../Overlay";
import classNames from "classnames";
import { useEffect, useState } from "react";

export interface DialogProps extends React.HTMLProps<HTMLDivElement> {
  // 用于通过属性控制Dialog是隐藏还是显示，自带动画效果
  open?: boolean;
  // 弹框的位置，不同的位置动画效果不一样，默认为屏幕居中
  position?: "top" | "middle" | "bottom";
  // 透明蒙层是否可以点击
  maskClosable?: boolean;
  // 弹框被彻底关闭（关闭动画结束）时执行的回调
  onClose?: () => void;
}

export function Dialog(props: React.PropsWithChildren<DialogProps>) {
  const {
    open = true,
    position = "middle",
    maskClosable = false,
    children,
    className,
    onClose,
    ...extra
  } = props;

  const [_open, setOpen] = useState<boolean>(open);

  useEffect(() => {
    if (open !== _open) {
      setOpen(open);
    }
  }, [open]);

  const classes: string[] = [];
  if (position === "top") {
    classes.push(style.top, _open ? style.topShow : style.topHide);
  } else if (position === "middle") {
    classes.push(style.middle, _open ? style.middleShow : style.middleHide);
  } else if (position === "bottom") {
    classes.push(style.bottom, _open ? style.bottomShow : style.bottomHide);
  }

  return (
    <Overlay
      className={classNames(
        style.container,
        _open ? style.containerShow : style.containerHide
      )}
      onClick={(event) => {
        if (maskClosable && event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
      onAnimationEnd={(event) => {
        if (event.animationName === style.MaskHide) {
          onClose?.();
        }
      }}
    >
      <div {...extra} className={classNames(classes, className)}>
        {children}
      </div>
    </Overlay>
  );
}
