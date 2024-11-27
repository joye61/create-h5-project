import style from "./index.module.css";
import classNames from "classnames";
export function Skeleton(props) {
    return (<div className={classNames(style.container, props.className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>);
}
