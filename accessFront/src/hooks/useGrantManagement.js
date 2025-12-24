import { 
  useContractRead, 
  useContractWrite, 
  usePrepareContractWrite, 
  useWaitForTransaction, 
  useAccount, 
  useChainId, 
  usePublicClient, 
  useWalletClient 
} from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../config/contracts';
import { useState, useEffect, useCallback } from 'react';
import { parseEther, formatEther } from 'viem';
import { sonicBlaze } from '../config/chains';

// Get ABIs from the contracts.js file
const { accessGrant: accessGrantAbi, ngoAccessControl: ngoAccessControlAbi } = CONTRACT_ABIS;

/**
 * Custom hook for managing grant-related operations
 * Handles grant creation, application, and management
 */
export function useGrantManagement() {
  // Wallet and network state
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === sonicBlaze.id;
  const publicClient = usePublicClient({ chainId: sonicBlaze.id });
  const { data: walletClient } = useWalletClient({ chainId: sonicBlaze.id });
  
  // State management
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
  });

  // Contract configuration
  const contractConfig = {
    address: CONTRACT_ADDRESSES.accessGrant,
    abi: accessGrantAbi,
  };

  // Check if user is an authorized NGO
  const { 
    data: isNGO, 
    isLoading: isLoadingNGOStatus,
    refetch: refetchNGOStatus 
  } = useContractRead({
    address: CONTRACT_ADDRESSES.ngoAccessControl,
    abi: ngoAccessControlAbi,
    functionName: 'isAuthorizedNGO',
    args: [address || '0x0000000000000000000000000000000000000000'],
    enabled: Boolean(address) && isConnected && isCorrectNetwork,
    onError: (err) => {
      console.error('Error checking NGO status:', err);
      setError('Failed to verify NGO status');
    },
  });

  // Fetch all grants
  const fetchGrants = useCallback(async () => {
    if (!isConnected || !isCorrectNetwork) return;
    
    setLoading(true);
    try {
      // This is a simplified example - you'll need to implement pagination in a real app
      const grantCount = await publicClient.readContract({
        ...contractConfig,
        functionName: 'getGrantCount',
      });
      
      const grantsData = [];
      for (let i = 0; i < Number(grantCount); i++) {
        const grant = await publicClient.readContract({
          ...contractConfig,
          functionName: 'grants',
          args: [i],
        });
        grantsData.push({
          id: i,
          ...grant,
        });
      }
      
      setGrants(grantsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching grants:', err);
      setError('Failed to fetch grants');
    } finally {
      setLoading(false);
    }
  }, [isConnected, isCorrectNetwork, publicClient]);

  // Create a new grant
  const { config: createGrantConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: 'createGrant',
    args: [
      'Grant Title', // title
      'Grant Description', // description
      parseEther('1000'), // totalAmount
      3, // milestoneCount
      30, // daysBetweenMilestones
    ],
    enabled: isNGO && isConnected && isCorrectNetwork,
  });

  const { data: createGrantData, write: createGrant } = useContractWrite({
    ...createGrantConfig,
    onSuccess: (data) => {
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: data.hash,
      });
    },
    onError: (err) => {
      setTransactionStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: err.message,
        txHash: null,
      });
    },
  });

  // Wait for transaction confirmation
  const { isLoading: isCreatingGrant } = useWaitForTransaction({
    hash: createGrantData?.hash,
    onSuccess: () => {
      setTransactionStatus({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        txHash: createGrantData.hash,
      });
      // Refresh grants after successful creation
      fetchGrants();
    },
  });

  // Apply for a grant
  const applyForGrant = async (grantId, proposal, requestedAmount) => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to the correct network');
      return;
    }

    try {
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: null,
      });

      const { request } = await publicClient.simulateContract({
        ...contractConfig,
        functionName: 'applyForGrant',
        args: [grantId, proposal, parseEther(requestedAmount.toString())],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: hash,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        setTransactionStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: hash,
        });
        // Refresh grants after successful application
        await fetchGrants();
        return { success: true, hash };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error applying for grant:', err);
      setTransactionStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: err.message,
        txHash: null,
      });
      return { success: false, error: err.message };
    }
  };

  // Approve a grant application
  const approveApplication = async (grantId, applicationId) => {
    if (!isNGO || !isConnected || !isCorrectNetwork) {
      setError('Unauthorized or incorrect network');
      return;
    }

    try {
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: null,
      });

      const { request } = await publicClient.simulateContract({
        ...contractConfig,
        functionName: 'approveApplication',
        args: [grantId, applicationId],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: hash,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        setTransactionStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: hash,
        });
        // Refresh grants after approval
        await fetchGrants();
        return { success: true, hash };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error approving application:', err);
      setTransactionStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: err.message,
        txHash: null,
      });
      return { success: false, error: err.message };
    }
  };

  // Complete a milestone
  const completeMilestone = async (grantId, milestoneIndex) => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to the correct network');
      return;
    }

    try {
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: null,
      });

      const { request } = await publicClient.simulateContract({
        ...contractConfig,
        functionName: 'completeMilestone',
        args: [grantId, milestoneIndex],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      
      setTransactionStatus({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: hash,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        setTransactionStatus({
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: hash,
        });
        // Refresh grants after completing milestone
        await fetchGrants();
        return { success: true, hash };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error completing milestone:', err);
      setTransactionStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: err.message,
        txHash: null,
      });
      return { success: false, error: err.message };
    }
  };

  // Fetch grants on component mount and when dependencies change
  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  return {
    // State
    grants,
    loading: loading || isLoadingNGOStatus,
    error,
    isNGO,
    isConnected,
    isCorrectNetwork,
    transactionStatus,
    
    // Actions
    createGrant,
    applyForGrant,
    approveApplication,
    completeMilestone,
    refetchGrants: fetchGrants,
  };
}
