import style from "./index.module.css";
import classNames from "classnames";
import { useViewport } from "../hooks";
/**
 * 安全区空白占位块
 * @param props
 * @returns
 */
export function SafeArea(props) {
    const { position = "bottomn", children, ...extra } = props;
    useViewport({ viewportFit: "cover" });
    const classes = [];
    if (position === "top") {
        classes.push(style.top);
    }
    else if (position === "bottom") {
        classes.push(style.bottom);
    }
    return (<div className={classNames(classes)} {...extra}>
      {children}
    </div>);
}
