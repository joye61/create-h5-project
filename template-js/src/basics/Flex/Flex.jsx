import classNames from "classnames";
import style from "./index.module.css";
export function Flex(props) {
    const { children, className, direction = "row", ...extra } = props;
    return (<div {...extra} className={classNames(direction === "column" ? style.column : style.row, className)}>
      {children}
    </div>);
}
