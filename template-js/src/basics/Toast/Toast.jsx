import style from "./Toast.module.css";
import classNames from "classnames";
import { useEffect, useState } from "react";
export function Toast(props) {
    const { children, position = "middle", duration = 2000, className, onHide, ...extra } = props;
    const [open, setOpen] = useState(true);
    const classes = [style.container];
    if (position === "top") {
        classes.push(style.top, open ? style.topShow : style.topHide);
    }
    else if (position === "middle") {
        classes.push(style.middle, open ? style.middleShow : style.middleHide);
    }
    else if (position === "bottom") {
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
    return (<div {...extra} className={classNames(classes, className)} onAnimationEnd={(event) => {
            if ([
                style.TopHideAnimation,
                style.MiddleHideAnimation,
                style.BottomHideAnimation,
            ].includes(event.animationName)) {
                onHide?.();
            }
        }}>
      {children}
    </div>);
}
