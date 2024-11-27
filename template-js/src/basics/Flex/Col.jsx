import style from "./index.module.css";
import classNames from "classnames";
import { Flex } from "./Flex";
export function ColStart(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.start, className)} {...extra}/>);
}
export function ColCenter(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.center, className)} {...extra}/>);
}
export function ColEnd(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.end, className)} {...extra}/>);
}
export function ColBetween(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.between, className)} {...extra}/>);
}
export function ColEvenly(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.evenly, className)} {...extra}/>);
}
export function ColAround(props) {
    const { className, ...extra } = props;
    return (<Flex direction="column" className={classNames(style.around, className)} {...extra}/>);
}
