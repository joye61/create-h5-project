import style from "./Alert.module.css";
import { Clickable } from "../Clickable";
import { ColStart } from "../Flex/Col";
import { RowStart } from "../Flex/Row";
import classNames from "classnames";

export interface AlertProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "title" | "content"> {
  title?: React.ReactNode;
  content: React.ReactNode;
  showCancel?: boolean;
  showConfirm?: boolean;
  cancel?: React.ReactNode;
  confirm?: React.ReactNode;
  onCancel?: () => void | Promise<void>;
  onConfirm?: () => void | Promise<void>;
  titleClass?: string;
  contentClass?: string;
  cancelClass?: string;
  confirmClass?: string;
  // 是否反转当前组件的颜色，由滤镜实现
  colorInvert?: boolean;
}

export function Alert(props: AlertProps) {
  const {
    title = "提示",
    content,
    showCancel = false,
    showConfirm = true,
    cancel = "取消",
    confirm = "确定",
    onCancel,
    onConfirm,
    titleClass,
    contentClass,
    cancelClass,
    confirmClass,
    className,
    colorInvert = false,
  } = props;

  // 是否显示按钮
  const showBtn = showCancel || showConfirm;

  return (
    <div
      className={classNames(
        style.container,
        colorInvert && style.containerInvert,
        className
      )}
    >
      <ColStart>
        {title && (
          <div className={classNames(style.title, titleClass)}>{title}</div>
        )}
        <div className={classNames(style.content, contentClass)}>{content}</div>
      </ColStart>
      {showBtn && (
        <RowStart>
          {showCancel && (
            <Clickable
              className={classNames(style.cancel, cancelClass)}
              flex="row-center"
              onClick={() => onCancel?.()}
            >
              {cancel}
            </Clickable>
          )}
          <Clickable
            className={classNames(style.confirm, confirmClass)}
            flex="row-center"
            onClick={() => onConfirm?.()}
          >
            {confirm}
          </Clickable>
        </RowStart>
      )}
    </div>
  );
}
