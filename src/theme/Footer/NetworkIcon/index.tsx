import React, { FC } from "react";
import {
  Icon24MailCircle,
  Icon24GithubCircle,
  Icon24LinkedInCircle,
  Icon24TelegramCircle,
  Icon24TwitterCircle,
  Icon24CoinMakertCap,
} from "../../../assets/icons/index";

import type { Network } from "../config";

interface NetworkIconProps {
  type: Network;
}

export const NetworkIcon: FC<NetworkIconProps> = ({ type }) => {
  switch (type) {
  case "coinmarketcap":
    return <Icon24CoinMakertCap />;
  case "telegram":
    return <Icon24TelegramCircle />;
  case "github":
    return <Icon24GithubCircle />;
  case "twitter":
    return <Icon24TwitterCircle />;
  case "mail":
    return <Icon24MailCircle />;
  case "linkedin":
    return <Icon24LinkedInCircle />;
  default:
    return null;
  }
};
