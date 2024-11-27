import "./index.css";
import { useViewport, useWindowResize } from "../hooks";
import { useEffect, useRef, useState } from "react";
export const DefaultDesignWidth = 750;
export function Container(props) {
    const { designWidth = DefaultDesignWidth, maxWidth = 576, minWidth = 312, children, } = props;
    const [docWidth, setDocWidth] = useState(Math.min(window.innerWidth, maxWidth));
    const styleRef = useRef(null);
    useViewport();
    useEffect(() => {
        styleRef.current = document.createElement("style");
        const first = document.querySelector("style");
        if (first instanceof HTMLStyleElement) {
            first.before(styleRef.current);
        }
        else {
            document.head.appendChild(styleRef.current);
        }
        return () => {
            styleRef.current?.remove();
            styleRef.current = null;
        };
    }, []);
    useWindowResize(() => {
        let width = window.innerWidth;
        if (width >= maxWidth) {
            width = maxWidth;
        }
        else if (width <= minWidth) {
            width = minWidth;
        }
        setDocWidth(width);
    });
    // 自适应逻辑核心
    useEffect(() => {
        const unit = docWidth / DefaultDesignWidth;
        const base = (docWidth * 100) / designWidth;
        const element = styleRef.current;
        if (element) {
            const rulesLen = element.sheet?.cssRules.length;
            if (rulesLen && rulesLen > 0) {
                for (let i = 0; i < rulesLen; i++) {
                    element.sheet?.deleteRule(0);
                }
            }
            const htmlRule = `
      html{
        --unit: ${unit}px;
        --wdoc: ${docWidth}px;
        font-size: ${base}px;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
        touch-action: manipulation;
      }
      `;
            const bodyRule = `
      body{
        max-width: ${maxWidth}px;
        min-width: ${minWidth}px;
        font-size: initial;
        margin: 0 auto;
      } 
      `;
            element.sheet?.insertRule(htmlRule);
            element.sheet?.insertRule(bodyRule);
        }
    }, [docWidth, minWidth, maxWidth, designWidth]);
    // 激活iOS上的:active伪类逻辑
    useEffect(() => {
        const activable = () => { };
        document.body.addEventListener("touchstart", activable);
        return () => {
            document.body.removeEventListener("touchstart", activable);
        };
    }, []);
    return children;
}
