import "./Text.scss";
import React, { FC } from "react";

interface TextProps {
  scheme?: "dark" | "light";
  className: string;
  children: string;
}

export const Text: FC<TextProps> = (props) => {
  const { scheme = "light", children, className, ...restProps } = props;

  return (
    <div
      className={`Text Text--weight-semi Text--level-1 Text--scheme-${scheme} ${className}`}
      {...restProps}
    >
      {children}
    </div>
  );
};
