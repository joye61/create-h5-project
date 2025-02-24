import style from "./Dialog.module.css";
import { Overlay } from "../Overlay";
import classNames from "classnames";
import { useEffect, useState } from "react";
export function Dialog(props) {
    const { open = true, position = "middle", maskClosable = false, children, className, onClose, ...extra } = props;
    const [_open, setOpen] = useState(open);
    useEffect(() => {
        if (open !== _open) {
            setOpen(open);
        }
    }, [open]);
    const classes = [];
    if (position === "top") {
        classes.push(style.top, _open ? style.topShow : style.topHide);
    }
    else if (position === "middle") {
        classes.push(style.middle, _open ? style.middleShow : style.middleHide);
    }
    else if (position === "bottom") {
        classes.push(style.bottom, _open ? style.bottomShow : style.bottomHide);
    }
    return (<Overlay className={classNames(style.container, _open ? style.containerShow : style.containerHide)} onClick={(event) => {
            if (maskClosable && event.target === event.currentTarget) {
                setOpen(false);
            }
        }} onAnimationEnd={(event) => {
            if (event.animationName === style.MaskHide) {
                onClose?.();
            }
        }}>
      <div {...extra} className={classNames(classes, className)}>
        {children}
      </div>
    </Overlay>);
}
