import "./NewCol.scss";
import React, { FC } from "react";

interface INewColProps {
  className?: string;
  withoutPaddings?: boolean;
  children: React.ReactNode;
}

export const NewCol: FC<INewColProps> = (props) => {
  const {
    className = "",
    children,
    withoutPaddings = false,
    ...otherProps
  } = props;

  return (
    <div
      className={`NewCol ${className} ${
        (`withoutPaddings` && Boolean(withoutPaddings)) || ""
      }`}
      {...otherProps}
    >
      {children}
    </div>
  );
};
