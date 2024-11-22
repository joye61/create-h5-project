import style from "./index.module.css";
import classNames from "classnames";
import { Flex, FlexProps } from "./Flex";

export function ColStart(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.start, className)}
      {...extra}
    />
  );
}

export function ColCenter(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.center, className)}
      {...extra}
    />
  );
}

export function ColEnd(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.end, className)}
      {...extra}
    />
  );
}

export function ColBetween(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.between, className)}
      {...extra}
    />
  );
}

export function ColEvenly(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.evenly, className)}
      {...extra}
    />
  );
}

export function ColAround(props: React.PropsWithChildren<FlexProps>) {
  const { className, ...extra } = props;
  return (
    <Flex
      direction="column"
      className={classNames(style.around, className)}
      {...extra}
    />
  );
}
