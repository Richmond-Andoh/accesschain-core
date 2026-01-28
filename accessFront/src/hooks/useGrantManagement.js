import { useContract } from '../context/ContractContext';
import { useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, AccessGrantABI } from '../config/contracts';
import { toast } from 'react-toastify';

export function useGrantManagement() {
  const { 
    grants, 
    loading: contextLoading, 
    userRole, 
    loadGrants,
    isConnected
  } = useContract();

  const { address } = useAccount();

  // Create Grant Write
  const { write: writeCreateGrant, data: createGrantData, isLoading: isCreating } = useContractWrite({
    address: CONTRACT_ADDRESSES.AccessGrant,
    abi: AccessGrantABI,
    functionName: 'createGrant',
  });

  const { isLoading: isWaitingForCreate } = useWaitForTransaction({
    hash: createGrantData?.hash,
    onSuccess: () => {
      toast.success('Grant created successfully on-chain!');
      loadGrants();
    },
    onError: (err) => {
      toast.error(`Grant creation failed: ${err.message}`);
    }
  });

  // Apply For Grant Write
  const { write: writeApplyForGrant, data: applyData, isLoading: isApplying } = useContractWrite({
    address: CONTRACT_ADDRESSES.AccessGrant,
    abi: AccessGrantABI,
    functionName: 'applyForGrant',
  });

  const { isLoading: isWaitingForApply } = useWaitForTransaction({
    hash: applyData?.hash,
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      loadGrants();
    }
  });

  const handleCreateGrant = async (title, description, amount, duration) => {
    if (!writeCreateGrant) return;
    writeCreateGrant({
      args: [title, description, amount, duration],
    });
  };

  const handleApplyForGrant = async (grantId, proposal, requestedAmount) => {
    if (!writeApplyForGrant) return;
    writeApplyForGrant({
      args: [BigInt(grantId), proposal, BigInt(requestedAmount)],
    });
  };

  const approveApplication = async (grantId, applicationIndex) => {
    // Logic for approval (requires NGO ownership check)
  };

  return {
    grants,
    loading: contextLoading || isCreating || isWaitingForCreate || isApplying || isWaitingForApply,
    error: null,
    isNGO: userRole === 'NGO' || userRole === 'ADMIN',
    isConnected,
    isCorrectNetwork: true,
    transactionStatus: { 
      isLoading: isCreating || isWaitingForCreate || isApplying || isWaitingForApply 
    },
    createGrant: handleCreateGrant,
    applyForGrant: handleApplyForGrant,
    approveApplication,
    refetchGrants: loadGrants,
    address
  };
}
