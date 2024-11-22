import style from "./Loading.module.css";
import { Overlay } from "../Overlay";
import { ColStart } from "../Flex";
import { Indicator } from "./Indicator";

export interface LoadingProps {
  message?: string;
}

export function Loading(props: LoadingProps) {
  const { message } = props;
  return (
    <Overlay translucent={false} className={style.container}>
      <ColStart>
        <Indicator color="black" />
        {message && <p>{message}</p>}
      </ColStart>
    </Overlay>
  );
}
