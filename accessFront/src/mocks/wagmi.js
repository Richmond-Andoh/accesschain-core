import { useState, useEffect } from 'react';

// Mock Wagmi Hooks
export const useAccount = () => ({
  address: '0xMockUserAddress1234567890',
  isConnected: false, // Default to disconnected for "clean" slate
  isConnecting: false,
  isDisconnected: true,
});

export const useConnect = () => ({
  connect: () => {},
  pendingConnector: null,
});

export const useDisconnect = () => ({
  disconnect: () => {},
});

export const useNetwork = () => ({
  chain: { id: 1, name: 'Mock Chain' },
});

export const useSwitchNetwork = () => ({
  switchNetwork: () => {},
});

export const useBalance = () => ({
  data: { formatted: '0.00', symbol: 'ETH' },
  isLoading: false,
});

export const useContractRead = () => ({
  data: null,
  isLoading: false,
});

export const useContractWrite = () => ({
  write: () => {},
  data: null,
  isLoading: false,
});

export const useWaitForTransaction = () => ({
  isLoading: false,
  isSuccess: true,
});

export const usePublicClient = () => ({
  readContract: async () => null,
});

export const useWalletClient = () => ({
  data: null,
});

export class MetaMaskConnector {
  constructor() {
    this.name = 'MetaMask';
  }
}

export class InjectedConnector {
  constructor() {
    this.name = 'Injected';
  }
}

export const useChainId = () => 1;

export const WagmiConfig = ({ children }) => children;
export const configureChains = () => ({ publicClient: {} });
export const createConfig = () => {};
export const mainnet = {}; 
export const localhost = {};
