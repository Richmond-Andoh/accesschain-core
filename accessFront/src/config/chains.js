export const sonicBlaze = {
  id: 111,
  name: 'Sonic Blaze',
  network: 'sonic-blaze',
  nativeCurrency: { name: 'Sonic', symbol: 'SONIC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.sonic.example.com'] } },
  blockExplorers: { default: { url: 'https://explorer.sonic.example.com' } }
};

export const sapphireTestnet = {
  id: 222,
  name: 'Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: { name: 'Sapphire', symbol: 'ROSE', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.sapphire.example.com'] } },
  blockExplorers: { default: { url: 'https://explorer.sapphire.example.com' } }
};

export const localhost = {
    id: 1337,
    name: 'Localhost',
    network: 'localhost',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['http://localhost:8545'] } },
    blockExplorers: { default: { url: 'https://localhost' } }
};

export const chains = [sonicBlaze, sapphireTestnet, localhost];
