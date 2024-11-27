import { useEffect, useState } from "react";
import { RowStart } from "../Flex/Row";
import { CountdownManager, } from "../time";
import React from "react";
export function Countdown(props) {
    let { 
    // 单位为秒
    remain = 0, seperator = ":", format = "his", onUpdate, onEnd, seperatorClass, numberClass, renderNumber, renderSeperator, ...extra } = props;
    const [value, setValue] = useState(null);
    let content = [];
    if (value && typeof value === "object") {
        for (let i = 0; i < format.length; i++) {
            // 渲染数字进组件
            const key = format[i];
            const num = value[key];
            let numberComponent;
            if (typeof renderNumber === "function") {
                numberComponent = renderNumber(num, key);
            }
            else {
                // 默认以span包围，且数字不足10的时候有前置0
                numberComponent = (<span className={numberClass}>{num < 10 ? `0${num}` : num}</span>);
            }
            content.push(<React.Fragment key={i}>{numberComponent}</React.Fragment>);
            // 添加分隔符，最后一个数字不需要分隔符
            if (i !== format.length - 1) {
                let seperatorComponent;
                if (typeof renderSeperator === "function") {
                    seperatorComponent = renderSeperator(num, key);
                }
                else {
                    seperatorComponent = seperator ? (<span className={seperatorClass}>{seperator}</span>) : null;
                }
                content.push(<React.Fragment key={`s${i}`}>{seperatorComponent}</React.Fragment>);
            }
        }
    }
    useEffect(() => {
        let instance = new CountdownManager({
            format,
            remain,
            onUpdate(current) {
                setValue(current);
                onUpdate?.(current);
            },
            onEnd() {
                onEnd?.();
            },
        });
        instance.start();
        // 执行清理逻辑
        return () => {
            instance?.stop();
            instance = null;
        };
    }, [format, remain]);
    return <RowStart {...extra}>{content}</RowStart>;
}
