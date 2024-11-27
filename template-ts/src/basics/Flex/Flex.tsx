import classNames from "classnames";
import style from "./index.module.css";

export interface FlexProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: "row" | "column";
}

export function Flex(props: FlexProps) {
  const { children, className, direction = "row", ...extra } = props;
  return (
    <div
      {...extra}
      className={classNames(
        direction === "column" ? style.column : style.row,
        className
      )}
    >
      {children}
    </div>
  );
}
