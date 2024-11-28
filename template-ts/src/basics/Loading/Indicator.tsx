import style from "./Indicator.module.css";
import classNames from "classnames";

export interface IndicatorProps {
  // 菊花的颜色，默认只支持黑白色
  color?: "white" | "black";
  // 菊花的大小
  size?: "big" | "small";
}

/**
 * 转菊花指示器
 * @param props
 * @returns
 */
export function Indicator(props: IndicatorProps) {
  const { color = "white", size = "big" } = props;

  const list: React.ReactElement[] = [];
  for (let index = 0; index < 12; index++) {
    list.push(
      <div className={style[`item${index}`]} key={index}>
        <div className={style[color]} />
      </div>
    );
  }
  const className = classNames(style.container, style[size]);
  return <div className={className}>{list}</div>;
}
