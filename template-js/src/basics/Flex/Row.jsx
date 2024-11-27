import style from "./index.module.css";
import classNames from "classnames";
import { Flex } from "./Flex";
export function RowStart(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.start, className)} {...extra}/>;
}
export function RowCenter(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.center, className)} {...extra}/>;
}
export function RowEnd(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.end, className)} {...extra}/>;
}
export function RowBetween(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.between, className)} {...extra}/>;
}
export function RowEvenly(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.evenly, className)} {...extra}/>;
}
export function RowAround(props) {
    const { className, ...extra } = props;
    return <Flex className={classNames(style.around, className)} {...extra}/>;
}
