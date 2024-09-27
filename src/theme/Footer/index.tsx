import React, { FC, useState, useEffect } from "react";
import "./Footer.scss";
import { NetworkIcon } from "./NetworkIcon";
import { Caption, Text } from "./Typography";
import { Logo } from "./Logo";
import { Separator } from "./Separator";
import { FOOTER_COLUMN_LINKS_EN, footerLinkExporter, NETWORKS } from "./config";
import { NewRow, NewCol } from "./GridSystem";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useColorMode } from "@docusaurus/theme-common";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface IFooterColumnContentProps {
  column: (typeof FOOTER_COLUMN_LINKS_EN)[0];
  scheme?: "dark" | "light";
}

const FooterColumnContent: FC<IFooterColumnContentProps> = ({
  column,
  scheme,
}) => {
  return (
    <>
      <Text className="CustomFooter__colHeader">{column.headerLangKey}</Text>
      <div className="CustomFooter__colLinks">
        {column.links.map((link) => (
          <a
            className="CustomFooter__colLink"
            href={link.url}
            key={link.langKey}
          >
            <Caption scheme={scheme}>{link.langKey}</Caption>
          </a>
        ))}
      </div>
    </>
  );
};

const LINKS_ROW_CONFIG = {
  sizeConfig: {
    mobile: 6,
    tabletS: 2.4,
    tabletM: 2.4,
    desktop: 2.4,
  },
  gutterConfig: {
    mobile: 16,
    tabletS: 16,
    tabletM: 16,
    desktop: 32,
  },
};

function Footer() {
  const { footer } = useThemeConfig();
  const { colorMode } = useColorMode();
  const [style, setStyle] = useState<typeof colorMode>("dark");
  const [FOOTER_COLUMN_LINKS, setFOOTER_COLUMN_LINKS] = useState(
    footerLinkExporter()
  );
  const { siteConfig, i18n } = useDocusaurusContext();

  useEffect(() => {
    setFOOTER_COLUMN_LINKS(footerLinkExporter(i18n.currentLocale));
  }, [i18n.currentLocale]);

  if (!footer) {
    return null;
  }

  useEffect(() => {
    const docColorMode = document.documentElement.getAttribute(
      "data-theme"
    ) as typeof colorMode;

    if (colorMode !== docColorMode) {
      setStyle(docColorMode);
    }
  }, []);

  useEffect(() => {
    setStyle(colorMode);
  }, [colorMode]);

  return (
    <footer
      className={`CustomFooter CustomFooter--m-scheme-${style} bootstrap-wrapper`}
    >
      <div className="container">
        <div className="CustomFooter__links">
          <NewRow
            sizeConfig={LINKS_ROW_CONFIG.sizeConfig}
            gutterConfig={LINKS_ROW_CONFIG.gutterConfig}
          >
            {FOOTER_COLUMN_LINKS.map((column) => (
              <NewCol key={column.headerLangKey}>
                <FooterColumnContent column={column} scheme={style} />
              </NewCol>
            ))}
          </NewRow>
        </div>
        <Separator scheme={style} />
        <div className="CustomFooter__copyrights">
          <Logo scheme={style} />
          <div>
            <div className="CustomFooter__networks">
              {NETWORKS.map((network, index) => (
                <a
                  key={index}
                  href={network.url}
                  className="CustomFooter__network"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <NetworkIcon type={network.type} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
