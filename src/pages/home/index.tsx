// import { useEffect } from "react";
import { showLoading } from "src/basics/Loading";
// import { Indicator } from "src/basics/Loading/Indicator";
// import { Loading } from "src/basics/Loading/Loading";
import { Clickable, showAlert, showDialog } from "src/basics";
import { showToast } from "src/basics/Toast";
import style from "./index.module.css";
import { Dialog } from "src/basics/Dialog/Dialog";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    showAlert(
      "这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示",
      { showCancel: true, title: null }
    );
  }, []);
  return (
    <div>
      {/* <Toast>网络异常，请重试~网络异常，请重试~网络异常，请重试~网络异常，请重试~网络异常，请重试~</Toast> */}
      <button
        onClick={() => {
          // const stop = showLoading();
          // const stop = showDialog(<div className={style.dialog} />);
          // setTimeout(stop, 3000);
          // showToast("网络异常，请重试~");
          showAlert(
            "这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示这是一个错误提示",
            { showCancel: true, colorInvert: true }
          );
        }}
      >
        按钮测试
      </button>
      {/* <Indicator color="black" />
      <Indicator color="black" size="small" />
      <Loading message="数据加载中..." /> */}
      {/* <Loading message="数据加载中" /> */}
      <Clickable block={false} className={style.btn} flex="row-center">
        测试按钮
      </Clickable>
      {/* <Dialog><div className={style.dialog}/></Dialog> */}
    </div>
  );
};
