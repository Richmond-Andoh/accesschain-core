import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KRNLProvider, createConfig } from '@krnl-dev/sdk-react-7702';
import { sepolia } from 'viem/chains';
import { DEMO_CONTRACTS } from './config/demo-contracts';

import { WagmiConfig } from 'wagmi';
import { config as wagmiConfig } from './config/web3';

// Create a client for React Query
const queryClient = new QueryClient();

// KRNL Configuration
const krnlConfig = createConfig({
  chain: sepolia,
  privyAppId: import.meta.env.VITE_PRIVY_APP_ID || 'dummy-privy-id',
  delegatedContractAddress: DEMO_CONTRACTS.KRNLVerifier,
  krnlNodeUrl: 'https://node.krnl.xyz', // Default node
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <KRNLProvider config={krnlConfig}>
          <App />
        </KRNLProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>
);
