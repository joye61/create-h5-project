import style from "./Alert.module.css";
import { Clickable } from "../Clickable";
import { ColStart } from "../Flex/Col";
import { RowStart } from "../Flex/Row";
import classNames from "classnames";
export function Alert(props) {
    const { title = "提示", content, showCancel = false, showConfirm = true, cancel = "取消", confirm = "确定", onCancel, onConfirm, titleClass, contentClass, cancelClass, confirmClass, className, colorInvert = false, } = props;
    // 是否显示按钮
    const showBtn = showCancel || showConfirm;
    return (<div className={classNames(style.container, colorInvert && style.containerInvert, className)}>
      <ColStart>
        {title && (<div className={classNames(style.title, titleClass)}>{title}</div>)}
        <div className={classNames(style.content, contentClass)}>{content}</div>
      </ColStart>
      {showBtn && (<RowStart>
          {showCancel && (<Clickable className={classNames(style.cancel, cancelClass)} flex="row-center" onClick={() => onCancel?.()}>
              {cancel}
            </Clickable>)}
          <Clickable className={classNames(style.confirm, confirmClass)} flex="row-center" onClick={() => onConfirm?.()}>
            {confirm}
          </Clickable>
        </RowStart>)}
    </div>);
}
