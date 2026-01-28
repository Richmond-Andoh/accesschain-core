import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESSES, NGOAccessControlABI, AccessGrantABI } from '../config/contracts';
import { DEMO_CONTRACTS, NGO_REGISTRY_ABI } from '../config/demo-contracts';
import { toast } from 'react-toastify';

const ContractContext = createContext();

export function ContractProvider({ children }) {
  const { address, isConnected } = useAccount();

  // 1. Fetch User Role from NGOAccessControl
  const { data: rawRole, isLoading: loadingRole } = useContractRead({
    address: CONTRACT_ADDRESSES.NGOAccessControl,
    abi: NGOAccessControlABI,
    functionName: 'userRoles',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Map uint8 role (returned as BigInt from wagmi) to string
  const roleMap = ['NONE', 'NGO', 'DONOR', 'ADMIN'];
  const userRole = rawRole !== undefined ? roleMap[Number(rawRole)] : null;

  // 2. Fetch KRNL Verification Status from NGORegistryDemo
  const { data: isVerified, isLoading: loadingVerification } = useContractRead({
    address: DEMO_CONTRACTS.NGORegistryDemo,
    abi: NGO_REGISTRY_ABI,
    functionName: 'isVerifiedNGO',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // 3. Fetch Grants from AccessGrant
  const { data: rawGrants, isLoading: loadingGrants, refetch: loadGrants } = useContractRead({
    address: CONTRACT_ADDRESSES.AccessGrant,
    abi: AccessGrantABI,
    functionName: 'getGrants',
    watch: true,
  });

  // 4. Registration Function
  const { write: writeRegister, data: registerData } = useContractWrite({
    address: CONTRACT_ADDRESSES.NGOAccessControl,
    abi: NGOAccessControlABI,
    functionName: 'registerAsNGO',
  });

  const { isLoading: isRegistering } = useWaitForTransaction({
    hash: registerData?.hash,
    onSuccess: () => {
      toast.success('Successfully registered on the platform!');
    }
  });

  const grants = rawGrants || [];
  const loading = loadingRole || loadingVerification || loadingGrants;

  const value = {
    isVerified: !!isVerified,
    userRole,
    grants,
    loading: loading || isRegistering,
    isConnected,
    loadGrants,
    registerAsNGO: writeRegister,
    checkVerification: async () => {}, // Handled by watch
    verifyIdentity: async () => true, // Mock for now or Link to NGO Reg
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    return {
        isVerified: false,
        userRole: null,
        grants: [],
        loading: false,
        isConnected: false,
        verifyIdentity: async () => {},
        checkVerification: async () => {},
        loadGrants: async () => {} 
    };
  }
  return context;
}
