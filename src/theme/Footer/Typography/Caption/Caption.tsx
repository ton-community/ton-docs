import React, { FC } from "react";
import "./Caption.scss";

interface CaptionProps {
  scheme?: "dark" | "light";
  children: string;
}

export const Caption: FC<CaptionProps> = (props) => {
  const { children, scheme = "light", ...restProps } = props;

  return (
    <div
      className={`Caption Caption--weight-regular Caption--scheme-${scheme} Caption--color-tertiary`}
      {...restProps}
    >
      {children}
    </div>
  );
};
