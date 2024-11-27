import style from "./index.module.css";
import { ColAround, ColBetween, ColCenter, ColEnd, ColEvenly, ColStart, } from "../Flex/Col";
import { RowAround, RowBetween, RowCenter, RowEnd, RowEvenly, RowStart, } from "../Flex/Row";
import classNames from "classnames";
const flexMap = {
    "row-start": RowStart,
    "row-end": RowEnd,
    "row-center": RowCenter,
    "row-between": RowBetween,
    "row-around": RowAround,
    "row-evenly": RowEvenly,
    "col-start": ColStart,
    "col-end": ColEnd,
    "col-center": ColCenter,
    "col-between": ColBetween,
    "col-around": ColAround,
    "col-evenly": ColEvenly,
};
export function Clickable(props) {
    const { children, flex, block = true, className, ...extra } = props;
    const classes = [style.container];
    if (!block) {
        classes.push(flex ? style.inlineFlex : style.inline);
    }
    const finalClass = classNames(classes, className);
    if (flex && flexMap[flex]) {
        const Wrapper = flexMap[flex];
        return (<Wrapper {...extra} className={finalClass}>
        {children}
      </Wrapper>);
    }
    return (<div {...extra} className={finalClass}>
      {children}
    </div>);
}
