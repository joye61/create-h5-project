import dayjs, { Dayjs, ConfigType } from "dayjs";
import { tick } from "./functions";

export type AgoValue = {
  // 多久以前数字值
  num: number;
  // 多久以前单位
  unit: "y" | "m" | "d" | "h" | "i" | "s";
  // 这是一个默认的格式化中文字符串
  format: string;
};

/**
 * 用于格式化显示：多久以前
 * @param date
 */
export function ago(date: dayjs.ConfigType): AgoValue {
  const now = dayjs();
  const input = dayjs(date);
  const aYearAgo = now.subtract(1, "year");
  const aMonthAgo = now.subtract(1, "month");
  const aDayAgo = now.subtract(1, "day");
  const aHourAgo = now.subtract(1, "hour");
  const aMinuteAgo = now.subtract(1, "minute");

  // 多少年前
  if (input.isBefore(aYearAgo)) {
    const diff = now.year() - input.year();
    const nYearsAgo = now.subtract(diff, "year");
    let showNum = diff;
    if (input.isAfter(nYearsAgo)) {
      showNum = diff - 1;
    }
    return {
      num: showNum,
      unit: "y",
      format: `${showNum}年前`,
    };
  }

  // 多少月前
  if (input.isBefore(aMonthAgo)) {
    let showNum = 1;
    for (let n = 2; n <= 12; n++) {
      const nMonthAgo = now.subtract(n, "month");
      if (input.isAfter(nMonthAgo)) {
        showNum = n - 1;
        break;
      }
    }
    return {
      num: showNum,
      unit: "m",
      format: `${showNum}个月前`,
    };
  }

  // 多少天前
  if (input.isBefore(aDayAgo)) {
    const showNum = Math.floor((now.unix() - input.unix()) / 86400);
    return {
      num: showNum,
      unit: "d",
      format: `${showNum}天前`,
    };
  }

  // 多少小时前
  if (input.isBefore(aHourAgo)) {
    const showNum = Math.floor((now.unix() - input.unix()) / 3600);
    return {
      num: showNum,
      unit: "h",
      format: `${showNum}个小时前`,
    };
  }

  // 多少分钟前
  if (input.isBefore(aMinuteAgo)) {
    const showNum = Math.floor((now.unix() - input.unix()) / 60);
    return {
      num: showNum,
      unit: "i",
      format: `${showNum}分钟前`,
    };
  }

  // 多少秒前
  const showNum = now.unix() - input.unix();
  let format;
  if (showNum > 10) {
    format = `${showNum}秒前`;
  } else {
    format = "刚刚";
  }
  return {
    num: showNum,
    unit: "s",
    format,
  };
}

export type CountdownValueIndex = "d" | "h" | "i" | "s";
export type CountdownValue = {
  [key in CountdownValueIndex]?: number;
};
export type UpdateCallback = (value: CountdownValue) => void;

export interface CountdownOption {
  // 倒计时剩余时间
  remain?: number | string;
  // 更新时触发
  onUpdate?: UpdateCallback;
  // 结束时触发
  onEnd?: () => void;
  // 格式dhis
  format?: string;
}

/**
 * 倒计时类
 */
export class Countdown {
  /**
   * 倒计时的剩余时间，单位为秒
   */
  total = 0;
  remain = 0;

  /**
   * 当前倒计时的格式
   * d：天
   * h：时
   * i：分
   * s：秒
   */
  format = ["d", "h", "i", "s"];

  // 逐帧tick
  _stopTick?: () => void;
  // 每次更新时都会调用
  _onUpdate?: UpdateCallback;
  // 结束时触发调用
  _onEnd?: () => void;

  constructor(option: CountdownOption) {
    if (typeof option.remain === "number" && option.remain >= 0) {
      this.total = this.remain = option.remain;
    }

    // 倒计时需要展示的时间格式
    if (typeof option.format === "string") {
      const parts = option.format.split("");
      const output: string[] = [];
      this.format.forEach((item) => {
        if (parts.includes(item)) {
          output.push(item);
        }
      });
      this.format = output;
    } else {
      // 设置默认的倒计时格式
      this.format = ["h", "i", "s"];
    }

    this._onUpdate = option.onUpdate;
    this._onEnd = option.onEnd;
  }

  onUpdate(callback: UpdateCallback) {
    this._onUpdate = callback;
  }

  onEnd(callback: () => void) {
    this._onEnd = callback;
  }

  start() {
    // 如果倒计时时间不够，直接返回
    if (this.remain <= 0) {
      this._stopTick?.();
      this._onUpdate?.(this.formatValue());
      this._onEnd?.();
      return;
    }

    // 初始化立即触发一次更新
    this._onUpdate?.(this.formatValue());

    // 记录倒计时开启时的时间
    const start = Date.now();

    this._stopTick = tick(() => {
      // 获取倒计时已经持续的时间
      const duration = Math.floor((Date.now() - start) / 1000);
      const currentRemain = this.total - duration;

      // 倒计时结束
      if (currentRemain <= 0) {
        this.remain = 0;
        this._stopTick?.();
        this._onUpdate?.(this.formatValue());
        this._onEnd?.();
        return;
      }

      // 调用更新，这里是防止一秒以内多次反复渲染
      if (currentRemain !== this.remain) {
        this.remain = currentRemain;
        this._onUpdate?.(this.formatValue());
      }
    });
  }

  // 停止倒计时
  stop() {
    this.total = this.remain;
    this._stopTick?.();
  }

  /**
   * 格式化每次更新的值
   * @param remainTime
   */
  formatValue(): CountdownValue {
    let remainTime = this.remain;
    const result: CountdownValue = {};

    this.format.forEach((key) => {
      switch (key) {
        case "d":
          result.d = Math.floor(remainTime / 86400);
          remainTime = remainTime - result.d * 86400;
          break;
        case "h":
          result.h = Math.floor(remainTime / 3600);
          remainTime = remainTime - result.h * 3600;
          break;
        case "i":
          result.i = Math.floor(remainTime / 60);
          remainTime = remainTime - result.i * 60;
          break;
        case "s":
          result.s = remainTime;
          break;
        default:
          break;
      }
    });
    return result;
  }
}

/**
 * 创建一个月历视图的原始数据表
 * @param usefulFormat dayjs构造函数可以识别的任意值
 * @param startFromSunday 是否以星期天作为一周的第一天
 * @param sizeGuarantee 是否保证生成表格始终有6行
 */
export function createCalendar(
  usefulFormat: ConfigType = dayjs(),
  startFromSunday = false,
  sizeGuarantee = true
) {
  const value = dayjs(usefulFormat);
  const startOfMonth = value.startOf("month");
  const endOfMonth = value.endOf("month");
  const monthStartDay = startOfMonth.date();
  const monthEndDay = endOfMonth.date();

  /**
   * 向列表中添加元素
   * @param element
   */
  const result: Array<Dayjs[]> = [];
  const addDayToResult = (day: Dayjs) => {
    const len = result.length;
    if (len === 0 || result[len - 1].length >= 7) {
      result.push([day]);
    } else {
      result[len - 1].push(day);
    }
  };

  if (startFromSunday) {
    const monthStartWeekDay = startOfMonth.day();
    const monthEndWeekDay = endOfMonth.day();
    // 1、补足上一个月天数
    for (let i = 0; i < monthStartWeekDay; i++) {
      addDayToResult(startOfMonth.subtract(monthStartWeekDay - i, "day"));
    }
    // 2、补足当月的天数
    for (let i = monthStartDay; i <= monthEndDay; i++) {
      addDayToResult(value.date(i));
    }
    // 3、补足下一个月天速
    for (let i = monthEndWeekDay + 1; i <= 6; i++) {
      addDayToResult(endOfMonth.add(i - monthEndWeekDay, "day"));
    }
  } else {
    const monthStartWeekDay = startOfMonth.day() || 7;
    const monthEndWeekDay = endOfMonth.day() || 7;

    // 1、补足上一个月天数
    for (let i = 1; i < monthStartWeekDay; i++) {
      addDayToResult(startOfMonth.subtract(monthStartWeekDay - i, "day"));
    }

    // 2、补足当月的天数
    for (let i = monthStartDay; i <= monthEndDay; i++) {
      addDayToResult(value.date(i));
    }

    // 3、补足下一个月天速
    for (let i = monthEndWeekDay + 1; i <= 7; i++) {
      addDayToResult(endOfMonth.add(i - monthEndWeekDay, "day"));
    }
  }

  // 4、如果保证了表格的尺寸，且结果只有5行
  if (result.length < 6 && sizeGuarantee) {
    const remain = (6 - result.length) * 7;
    const lastDayOfTable = result[result.length - 1][6];
    for (let i = 1; i <= remain; i++) {
      addDayToResult(lastDayOfTable.add(i, "day"));
    }
  }

  return result;
}
