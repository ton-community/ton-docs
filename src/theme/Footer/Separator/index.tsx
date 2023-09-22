import React, { HTMLAttributes } from "react";
import "./Separator.scss";

export interface ISeparatorProps extends HTMLAttributes<HTMLElement> {
  scheme: "dark" | "light";
}

export const Separator: React.FC<ISeparatorProps> = (props) => {
  const { scheme = "light", className, ...otherProps } = props;

  return (
    <div
      className={`Separator Separator--m-scheme-${scheme} ${className}`}
      {...otherProps}
    ></div>
  );
};
