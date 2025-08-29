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
const PAGE_TONCOIN = "https://ton.org/toncoin";
const PAGE_STAKE = "https://ton.org/stake";
const PAGE_VALIDATOR = "https://ton.org/validator";
const PAGE_MINING = "https://ton.org/mining";
const PAGE_COMMUNITY = "https://ton.org/community";
const PAGE_ROADMAP = "https://ton.org/roadmap";
const PAGE_BRAND_ASSETS = "https://ton.org/brand-assets";
const PAGE_BUY_TONCOIN = "https://ton.org/buy-toncoin";
const PAGE_WALLETS = "https://ton.org/wallets";
const PAGE_DEV = "https://ton.org/dev";
const PAGE_TELEGRAM_MINI_APPS = "https://ton.org/mini-apps";
const PAGE_SUSTAINABILITY = "https://sustainability.ton.org/";
const PAGE_BUILDERS_PORTAL = "https://builders.ton.org";
const PAGE_BRIDGE_URL = "https://ton.org/bridges";
const PAGE_USDT = "https://ton.org/borderless";
const PAGE_ACCEPT_PAYMENT = "https://ton.org/payments";
const PAGE_DECENTRALIZED_NETWORK = "https://ton.org/decentralized-network";
const PAGE_TALENT = "https://ton.org/talents";
const PAGE_GAMEFI = "https://ton.org/gamefi";
const PAGE_MEMECOIN_TOKENS = "https://ton.org/memelandia";
const PAGE_COMMUNITY_TOOLS = "https://ton.org/community-tools";
const PAGE_TON_SITES = "https://ton.org/ton-sites";

const TON_DEV_COMMUNITY_TELEGRAM_URL = "https://t.me/addlist/1r5Vcb8eljk5Yzcy";
const WHITEPAPER_URL = "https://ton.org/whitepaper.pdf";
const TON_DOCUMENTATION_URL = "https://docs.ton.org/";
const APP_AND_DAPPS_URL = "https://t.me/tapps_bot/center?startApp=section_web3-tonorgtma";
const DNS_URL = "https://dns.ton.org/";
const CAREERS_URL = "https://jobs.ton.org/jobs";
const BUG_BOUNTY_URL = "https://github.com/ton-blockchain/bug-bounty";
const TON_FORUM_URL = "https://tonresear.ch";
const TON_CONCEPT_URL = "v3/concepts/dive-into-ton/introduction";
const TONSTAT_URL = "https://www.tonstat.com/";
const TON_BLOG_URL = "https://blog.ton.org";

const FOOTER_APP_AND_DAPPS_URL = APP_AND_DAPPS_URL;
const FOOTER_WHITEPAPER_URL = WHITEPAPER_URL;
const FOOTER_DOCUMENTATION_URL = TON_DOCUMENTATION_URL;
const FOOTER_DEV_COMMUNITY_URL = TON_DEV_COMMUNITY_TELEGRAM_URL;
const FOOTER_BUG_BOUNTY_URL = BUG_BOUNTY_URL;
const FOOTER_TON_FORUM_URL = TON_FORUM_URL;
const FOOTER_BRIDGE_URL = PAGE_BRIDGE_URL;
const FOOTER_CAREERS_URL = CAREERS_URL;
const FOOTER_DNS_URL = DNS_URL;
const FOOTER_TON_CONCEPT_URL = TON_CONCEPT_URL;

export const FOOTER_COLUMN_LINKS_EN = [
  {
    headerLangKey: "Use",
    links: [
      { langKey: "Get a Wallet", url: PAGE_WALLETS },
      { langKey: "Get Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "Stake", url: PAGE_STAKE },
      { langKey: "Accept Payments", url: PAGE_ACCEPT_PAYMENT },
      { langKey: "Apps & Services", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "Domains", url: FOOTER_DNS_URL },
      { langKey: "USDT on TON", url: PAGE_USDT },
      { langKey: "Cross-Chain Bridges", url: FOOTER_BRIDGE_URL },
    ],
  },
  {
    headerLangKey: "Learn",
    links: [
      { langKey: "TON Concept", url: FOOTER_TON_CONCEPT_URL }, // it doesn't work, cause we use updated doc URL
      { langKey: "Decentralized Network", url: PAGE_DECENTRALIZED_NETWORK },
      { langKey: "Roadmap", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "History of Mining", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TONCOIN },
      { langKey: "Validators", url: PAGE_VALIDATOR },
      { langKey: "White Paper", url: FOOTER_WHITEPAPER_URL },
      { langKey: "Brand Assets", url: PAGE_BRAND_ASSETS },
      { langKey: "Sustainability", url: PAGE_SUSTAINABILITY },
    ],
  },
  {
    headerLangKey: "For Builders",
    links: [
      { langKey: "TON Builders Portal", url: PAGE_BUILDERS_PORTAL },
      { langKey: "Getting Started", url: PAGE_DEV },
      { langKey: "Documentation", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "Telegram Mini Apps", url: PAGE_TELEGRAM_MINI_APPS },
      { langKey: "Dev Chats", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "Bug Bounty", url: FOOTER_BUG_BOUNTY_URL },
      { langKey: "Find a Job", url: FOOTER_CAREERS_URL },
      { langKey: "Find a Talent", url: PAGE_TALENT },

    ],
  },
  {
    headerLangKey: "Use Cases",
    links: [
      { langKey: "GameFi", url: PAGE_GAMEFI },
      { langKey: "Memecoins & Tokens", url: PAGE_MEMECOIN_TOKENS },
      { langKey: "Community Tools", url: PAGE_COMMUNITY_TOOLS },
      { langKey: "TON Sites", url: PAGE_TON_SITES },
    ],
  },
  {
    headerLangKey: "Community",
    links: [
      { langKey: "Communities", url: PAGE_COMMUNITY },
      { langKey: "Blog", url: TON_BLOG_URL },
      { langKey: "Careers", url: FOOTER_CAREERS_URL },
    ],
  },
];

export const FOOTER_COLUMN_LINKS_CN = [
  {
    headerLangKey: "使用",
    links: [
      { langKey: "获取钱包", url: PAGE_WALLETS },
      { langKey: "获取或出售 Toncoin", url: PAGE_BUY_TONCOIN },
      { langKey: "质押", url: PAGE_STAKE },
      { langKey: "接受支付", url: PAGE_ACCEPT_PAYMENT },
      { langKey: "应用和服务", url: FOOTER_APP_AND_DAPPS_URL },
      { langKey: "域名", url: FOOTER_DNS_URL },
      { langKey: "TON 上的 USDT", url: PAGE_USDT },
      { langKey: "桥接", url: FOOTER_BRIDGE_URL },

    ],
  },
  {
    headerLangKey: "学习",
    links: [
      { langKey: "TON概念", url: FOOTER_TON_CONCEPT_URL },
      { langKey: "去中心化网络", url: PAGE_DECENTRALIZED_NETWORK },
      { langKey: "路线图", url: PAGE_ROADMAP },
      { langKey: "TonStat", url: TONSTAT_URL },
      { langKey: "挖矿历史", url: PAGE_MINING },
      { langKey: "Toncoin", url: PAGE_TONCOIN },
      { langKey: "验证者", url: PAGE_VALIDATOR },
      { langKey: "白皮书", url: FOOTER_WHITEPAPER_URL },
      { langKey: "品牌资产", url: PAGE_BRAND_ASSETS },
      { langKey: "可持续发展", url: PAGE_SUSTAINABILITY },
    ],
  },
  {
    headerLangKey: "构建",
    links: [
      { langKey: "TON 构建者门户", url: PAGE_BUILDERS_PORTAL },
      { langKey: "入门指南", url: PAGE_DEV },
      { langKey: "文档", url: FOOTER_DOCUMENTATION_URL },
      { langKey: "Telegram 小程序", url: PAGE_TELEGRAM_MINI_APPS },
      { langKey: "开发者论坛", url: FOOTER_TON_FORUM_URL },
      { langKey: "开发社区", url: FOOTER_DEV_COMMUNITY_URL },
      { langKey: "漏洞赏金", url: FOOTER_BUG_BOUNTY_URL },
      { langKey: "寻找职位", url: FOOTER_CAREERS_URL },
      { langKey: "寻找人才", url: PAGE_TALENT },
    ],
  },
  {
    headerLangKey: "应用场景",
    links: [
      { langKey: "链游", url: PAGE_GAMEFI },
      { langKey: "迷因币与代币", url: PAGE_MEMECOIN_TOKENS },
      { langKey: "社区工具", url: PAGE_COMMUNITY_TOOLS },
      { langKey: "TON 站点", url: PAGE_TON_SITES },
    ],
  },
  {
    headerLangKey: "社区",
    links: [
      { langKey: "社区", url: PAGE_COMMUNITY },
      { langKey: "博客", url: TON_BLOG_URL },
      { langKey: "职业", url: FOOTER_CAREERS_URL },
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
