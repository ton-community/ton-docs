import "./NewRow.scss";
import React, { CSSProperties, FC, useMemo } from "react";

export const GRID_COLUMNS_COUNT = 12;

export type GutterConfigType = {
  mobile: number;
  tabletS: number;
  tabletM: number;
  desktop: number;
  desktopLarge?: number;
};

export type SizeConfigType = {
  mobile: number | Array<number>;
  tabletS: number | Array<number>;
  tabletM: number | Array<number>;
  desktop: number | Array<number>;
  desktopLarge?: number | Array<number>;
};

export type NewRowJustifyType = "flex-start" | "space-between";

interface INewRowProps {
  gutterConfig?: GutterConfigType;
  sizeConfig?: SizeConfigType;
  className?: string;
  justify?: NewRowJustifyType;
  noGutter?: boolean;
  gridLayout?: "left-triangle";
  withoutPaddings?: boolean;
  children: React.ReactNode;
}

interface NewRowCssType extends CSSProperties {
  "--mobileGridGap": number;
  "--tabletSGridGap": number;
  "--tabletMGridGap": number;
  "--desktopGridGap": number;
  "--desktopLargeGridGap": number;
  "--mobileGridSize": string;
  "--tabletSGridSize": string;
  "--tabletMGridSize": string;
  "--desktopGridSize": string;
  "--desktopLargeGridSize": string;
}

export const NewRow: FC<INewRowProps> = (props) => {
  const {
    gutterConfig = {
      mobile: 16,
      tabletS: 16,
      tabletM: 16,
      desktop: 40,
      desktopLarge: 40,
    },
    sizeConfig = {
      mobile: 12,
      tabletS: 12,
      tabletM: 12,
      desktop: 6,
      desktopLarge: 6,
    },
    children,
    className = "",
    noGutter = false,
    gridLayout = "",
    withoutPaddings = false,
    ...otherProps
  } = props;

  function getIsSizePrimitiveType(size: number | Array<number>) {
    if (typeof size === "number") {
      return true;
    }
    return false;
  }

  function getCommonColumnsLayoutGrid(size: number) {
    return `repeat(auto-fill, calc((100% / ${GRID_COLUMNS_COUNT}) * ${size}))`;
  }

  function getCustomColumnsLayoutGrid(columns: Array<number>) {
    return columns.map((num) => num + "fr").join(" ");
  }

  const NewRowStyles: NewRowCssType = useMemo(() => {
    const desktopLargeSize = sizeConfig.desktopLarge
      ? sizeConfig.desktopLarge
      : sizeConfig.desktop;
    const desktopLargeGutter = gutterConfig.desktopLarge
      ? gutterConfig.desktopLarge
      : gutterConfig.desktop;
    return {
      "--mobileGridGap": noGutter ? 0 : gutterConfig.mobile,
      "--tabletSGridGap": noGutter ? 0 : gutterConfig.tabletS,
      "--tabletMGridGap": noGutter ? 0 : gutterConfig.tabletM,
      "--desktopGridGap": noGutter ? 0 : gutterConfig.desktop,
      "--desktopLargeGridGap": noGutter ? 0 : desktopLargeGutter,

      "--mobileGridSize": getIsSizePrimitiveType(sizeConfig.mobile)
        ? getCommonColumnsLayoutGrid(sizeConfig.mobile as number)
        : getCustomColumnsLayoutGrid(sizeConfig.mobile as Array<number>),

      "--tabletSGridSize": getIsSizePrimitiveType(sizeConfig.tabletS)
        ? getCommonColumnsLayoutGrid(sizeConfig.tabletS as number)
        : getCustomColumnsLayoutGrid(sizeConfig.tabletS as Array<number>),

      "--tabletMGridSize": getIsSizePrimitiveType(sizeConfig.tabletM)
        ? getCommonColumnsLayoutGrid(sizeConfig.tabletM as number)
        : getCustomColumnsLayoutGrid(sizeConfig.tabletM as Array<number>),

      "--desktopGridSize": getIsSizePrimitiveType(sizeConfig.desktop)
        ? getCommonColumnsLayoutGrid(sizeConfig.desktop as number)
        : getCustomColumnsLayoutGrid(sizeConfig.desktop as Array<number>),

      "--desktopLargeGridSize": getIsSizePrimitiveType(desktopLargeSize)
        ? getCommonColumnsLayoutGrid(desktopLargeSize as number)
        : getCustomColumnsLayoutGrid(desktopLargeSize as Array<number>),
    };
  }, [sizeConfig, noGutter, gutterConfig]);

  return (
    <div
      className={`NewRow ${className} ${
        (`NewRow-m-${gridLayout}` && Boolean(gridLayout)) || ""
      } ${(`withoutPaddings` && Boolean(withoutPaddings)) || ""}`}
      style={NewRowStyles}
      {...otherProps}
    >
      {children}
    </div>
  );
};
