import style from "./index.module.css";
import classNames from "classnames";
export function Overlay(props) {
    const { children, translucent = true, className, ...extra } = props;
    return (<div {...extra} className={classNames(style.container, translucent && style.translucent, className)}>
      {children}
    </div>);
}
