import React, { FC } from "react";
import "./Logo.scss";
import { IconLogo, IconLogoSmall } from "../../../assets/icons/index";

interface LogoProps {
  scheme?: "dark" | "light";
}

export const Logo: FC<LogoProps> = ({ scheme }) => {
  return (
    <a className={`Logo Logo--${scheme}`} href="/">
      <div className="Logo__inner Logo__inner--large">
        <IconLogo />
      </div>
      <div className="Logo__inner Logo__inner--small">
        <IconLogoSmall />
      </div>
    </a>
  );
};
