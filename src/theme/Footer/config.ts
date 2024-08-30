// social networks
const TON_LINKEDIN_URL = "https://www.linkedin.com/company/ton-blockchain/";
const TONCOIN_TELEGRAM_URL = "https://t.me/toncoin";
const GITHUB_URL = "https://github.com/ton-blockchain";
const TON_TWITTER_URL = "https://twitter.com/ton_blockchain";
const MAIL_TO_URL = "mailto:partnership@ton.org";
const COIN_MARKETCAP_URL = "https://coinmarketcap.com/currencies/toncoin/";

export type Network =
  | "telegram"
  | "github"
  | "twitter"
  | "mail"
  | "linkedin"
  | "coinmarketcap"
  | "website";

interface INetwork {
  type: Network;
  url: string;
}
export const NETWORKS: Array<INetwork> = [
  { type: "linkedin", url: TON_LINKEDIN_URL },
  { type: "telegram", url: TONCOIN_TELEGRAM_URL },
  { type: "github", url: GITHUB_URL },
  { type: "twitter", url: TON_TWITTER_URL },
  { type: "mail", url: MAIL_TO_URL },
  { type: "coinmarketcap", url: COIN_MARKETCAP_URL },
];

// footer links
const PAGE_TON_COIN = "https://ton.org/toncoin";
const PAGE_STAKE = "https://ton.org/stake";
const PAGE_VALIDATOR = "https://ton.org/validator";
const PAGE_MINING = "https://ton.org/mining";
const PAGE_COMMUNITY = "https://ton.org/community";
const PAGE_ROADMAP = "https://ton.org/roadmap";
const PAGE_ANALYSIS = "https://ton.org/analysis";
const PAGE_BRAND_ASSETS = "https://ton.org/brand-assets";
const PAGE_GRANTS = "https://ton.org/grants";
const PAGE_BUY_TONCOIN = "https://ton.org/buy-toncoin";
const PAGE_EVENTS = "https://ton.org/events";
const PAGE_WALLETS = "https://ton.org/wallets";
const PAGE_DEV = "https://ton.org/dev";
const PAGE_CONTACT_US = "https://ton.org/contact-us";
const PAGE_COLLABORATE = "https://ton.org/collaborate";
const PAGE_LIQUIDITY_PROGRAM = "https://ton.org/defi-liquidity-program";
const TON_DEV_COMMUNITY_TELEGRAM_URL = "https://t.me/tondev_eng";
const WHITEPAPER_URL = "https://ton.org/whitepaper.pdf";
const TON_DOCUMENTATION_URL = "https://docs.ton.org/";
const APP_AND_DAPPS_URL = "https://ton.app/";
const BRIDGE_URL = "https://bridge.ton.org";
const DNS_URL = "https://dns.ton.org/";
const CAREERS_URL = "https://jobs.ton.org/jobs";
const BUG_BOUNTY_URL = "https://github.com/ton-blockchain/bug-bounty";
const TON_OVERFLOW_URL = "https://tonresear.ch";
const TON_CONCEPT_URL = "https://docs.ton.org/learn/introduction";
const TON_FOOTSTEPS = "https://github.com/ton-society/ton-footsteps";
const TON_BLOG_PRESS_RELEASES_URL = "https://blog.ton.org/category/news";
const TONSTAT_URL = "https://www.tonstat.com/";
const TON_BLOG_URL = "https://blog.ton.org";
const TON_FOUNDATION_URL = "https://ton.foundation/";
const FOOTER_APP_AND_DAPPS_URL = APP_AND_DAPPS_URL;
const FOOTER_WHITEPAPER_URL = WHITEPAPER_URL;
const FOOTER_DOCUMENTATION_URL = TON_DOCUMENTATION_URL;
const FOOTER_DEV_COMMUNITY_URL = TON_DEV_COMMUNITY_TELEGRAM_URL;
const FOOTER_BUG_BOUNTY_URL = BUG_BOUNTY_URL;
const FOOTER_TON_OVERFLOW_URL = TON_OVERFLOW_URL;
const FOOTER_BRIDGE_URL = BRIDGE_URL;
const FOOTER_CAREERS_URL = CAREERS_URL;
const FOOTER_DNS_URL = DNS_URL;
const FOOTER_SUPPORT_AND_FEEDBACK = "https://t.me/ton_help_bot";
const FOOTER_TON_CONCEPT_URL = TON_CONCEPT_URL;
const FOOTER_TON_FOOTSTEPS_URL = TON_FOOTSTEPS;
const FOOTER_PRESS_RELEASES_URL = TON_BLOG_PRESS_RELEASES_URL;

export const FOOTER_COLUMN_LINKS_EN = [
  {
    headerLangKey: "Use",
    links: [
      { langKey: "Get a wallet", url: PAGE_WALLETS },
      { langKey: "Get or sell Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "Stake", url: PAGE_STAKE },
      { langKey: "Apps & Servies", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "Bridge", url: FOOTER_BRIDGE_URL },
      { langKey: "Domains", url: FOOTER_DNS_URL },
    ],
  },
  {
    headerLangKey: "Learn",
    links: [
      { langKey: "TON Concept", url: FOOTER_TON_CONCEPT_URL },
      { langKey: "Roadmap", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "History of mining", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TON_COIN },
      { langKey: "Validators", url: PAGE_VALIDATOR },
      { langKey: "Blockchain comparison", url: PAGE_ANALYSIS },
      { langKey: "White paper", url: FOOTER_WHITEPAPER_URL },
    ],
  },
  {
    headerLangKey: "Build",
    links: [
      { langKey: "Getting started", url: PAGE_DEV },
      { langKey: "Documentation", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "TON Overflow", url: FOOTER_TON_OVERFLOW_URL },
      { langKey: "Dev Community", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "Grants", url: PAGE_GRANTS },
      { langKey: "Liquidity Program", url: PAGE_LIQUIDITY_PROGRAM },
      { langKey: "TON Footsteps", url: FOOTER_TON_FOOTSTEPS_URL },
      { langKey: "Bug Bounty", url: FOOTER_BUG_BOUNTY_URL },
    ],
  },
  {
    headerLangKey: "Community",
    links: [
      { langKey: "Communities", url: PAGE_COMMUNITY },
      { langKey: "TON Foundation", url: TON_FOUNDATION_URL },
      { langKey: "Events", url: PAGE_EVENTS },
      { langKey: "Collaborate", url: PAGE_COLLABORATE },
      { langKey: "Blog", url: TON_BLOG_URL },
      { langKey: "Press releases", url: FOOTER_PRESS_RELEASES_URL },
      { langKey: "Careers", url: FOOTER_CAREERS_URL },
    ],
  },
  {
    headerLangKey: "Other",
    links: [
      { langKey: "Support and Feedback", url: FOOTER_SUPPORT_AND_FEEDBACK },
      { langKey: "Brand assets", url: PAGE_BRAND_ASSETS },
      { langKey: "Contact us", url: PAGE_CONTACT_US },
    ],
  },
];

export const FOOTER_COLUMN_LINKS_CN = [
  {
    headerLangKey: "使用",
    links: [
      { langKey: "获取钱包", url: PAGE_WALLETS },
      { langKey: "获取或出售Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "质押", url: PAGE_STAKE },
      { langKey: "应用和服务", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "桥接", url: FOOTER_BRIDGE_URL },
      { langKey: "域名", url: FOOTER_DNS_URL },
    ],
  },
  {
    headerLangKey: "学习",
    links: [
      { langKey: "TON概念", url: FOOTER_TON_CONCEPT_URL },
      { langKey: "路线图", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "挖矿历史", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TON_COIN },
      { langKey: "验证者", url: PAGE_VALIDATOR },
      { langKey: "区块链比较", url: PAGE_ANALYSIS },
      { langKey: "白皮书", url: FOOTER_WHITEPAPER_URL },
    ],
  },
  {
    headerLangKey: "构建",
    links: [
      { langKey: "入门指南", url: PAGE_DEV },
      { langKey: "文档", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "TON Overflow", url: FOOTER_TON_OVERFLOW_URL },
      { langKey: "开发社区", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "赠款", url: PAGE_GRANTS },
      { langKey: "流动性计划", url: PAGE_LIQUIDITY_PROGRAM },
      { langKey: "TON Footsteps", url: FOOTER_TON_FOOTSTEPS_URL },
      { langKey: "漏洞赏金", url: FOOTER_BUG_BOUNTY_URL },
    ],
  },
  {
    headerLangKey: "社区",
    links: [
      { langKey: "社区", url: PAGE_COMMUNITY },
      { langKey: "TON基金会", url: TON_FOUNDATION_URL },
      { langKey: "活动", url: PAGE_EVENTS },
      { langKey: "合作", url: PAGE_COLLABORATE },
      { langKey: "博客", url: TON_BLOG_URL },
      { langKey: "新闻稿", url: FOOTER_PRESS_RELEASES_URL },
      { langKey: "职业", url: FOOTER_CAREERS_URL },
    ],
  },
  {
    headerLangKey: "其他",
    links: [
      { langKey: "支持和反馈", url: FOOTER_SUPPORT_AND_FEEDBACK },
      { langKey: "品牌资产", url: PAGE_BRAND_ASSETS },
      { langKey: "联系我们", url: PAGE_CONTACT_US },
    ],
  },
];

export function footerLinkExporter(lang?: string) {
  const FOOTER_LINKS_TRANSLATIONS = {
    mandarin: FOOTER_COLUMN_LINKS_CN,
  };

  return (
    FOOTER_LINKS_TRANSLATIONS?.[lang?.toLowerCase()] ?? FOOTER_COLUMN_LINKS_EN
  );
}
