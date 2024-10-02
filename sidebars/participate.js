/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarConfig}
 */
module.exports = [
  'participate/README',
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Infrastructure </small></b></span>',
  },
  'participate/explorers',
  {
    type: 'category',
    label: 'Cross-chain Bridges',
    items: [
      {
        type: 'doc',
        label: 'Overview',
        id: 'participate/crosschain/overview',
      },
      {
        type: 'doc',
        label: 'Bridges Addresses',
        id: 'participate/crosschain/bridge-addresses',
      },
    ],
  },
  {
    type: 'category',
    label: 'Blockchain Nodes',
    items: [
      'participate/nodes/node-types',
      'participate/run-nodes/mytonctrl',
      'participate/run-nodes/run-docker',
      'participate/run-nodes/full-node',
      'participate/run-nodes/enable-liteserver-node',
      'participate/run-nodes/become-validator',
      'participate/run-nodes/archive-node',
      'participate/run-nodes/nodes-troubleshooting',
      'participate/nodes/node-maintenance-and-security',
      'participate/run-nodes/local-ton',
      'participate/run-nodes/secure-guidelines',
      'participate/run-nodes/mytonctrl-status',
      'participate/run-nodes/faq',
      'participate/run-nodes/node-commands',
    ],
  },
  {
    type: 'category',
    label: 'Network Infrastructure',
    items: [
      'participate/network-maintenance/staking-incentives',
      'participate/network-maintenance/single-nominator',
      'participate/network-maintenance/nominator-pool',
      'participate/network-maintenance/nominators',
      'participate/network-maintenance/persistent-states',
      'participate/nodes/collators',
      'participate/network-maintenance/custom-overlays',
    ],
  },
  {
    'type': 'html',
    'value': '<hr/>',
  },
  {
    'type': 'html',
    'value': '<span class=\'menu__link\'><b><small> Web3 </small></b></span>',
  },
  'participate/web3/overview',
  {
    'type': 'category',
    'label': 'TON DNS',
    'items': [
      'participate/web3/dns',
      'develop/howto/subresolvers',
    ],
  },
  {
    'type': 'category',
    'label': 'TON Proxy & Sites',
    'items': [
      'develop/dapps/tutorials/how-to-run-ton-site',
      'participate/web3/app-sites',
      'participate/web3/setting-proxy',
      'participate/web3/how-to-open-any-ton-site',
      'participate/web3/site-management',
    ],
  },
  {
    'type': 'category',
    'label': 'TON Storage',
    'items': [
      'participate/ton-storage/storage-daemon',
      'participate/ton-storage/storage-provider',
      'participate/ton-storage/storage-faq',
    ],
  },
];
