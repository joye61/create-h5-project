import style from "./index.module.css";
import classNames from "classnames";
import { Flex, FlexProps } from "./Flex";

export function RowStart(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.start, className)} {...extra} />;
}

export function RowCenter(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.center, className)} {...extra} />;
}

export function RowEnd(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.end, className)} {...extra} />;
}

export function RowBetween(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.between, className)} {...extra} />;
}

export function RowEvenly(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.evenly, className)} {...extra} />;
}

export function RowAround(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return <Flex className={classNames(style.around, className)} {...extra} />;
}
