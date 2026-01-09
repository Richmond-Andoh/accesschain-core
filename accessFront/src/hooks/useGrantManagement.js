import { useContract } from '../context/ContractContext';

export function useGrantManagement() {
  const { 
    grants, 
    loading: contextLoading, 
    userRole, 
    createGrant, 
    applyForGrant, 
    loadGrants 
  } = useContract();

  const isConnected = false;
  const localLoading = false;
  const error = null;
  const transactionStatus = { isLoading: false };

  const handleCreateGrant = async () => {};
  const handleApplyForGrant = async () => ({ success: true });
  const approveApplication = async () => ({ success: true });
  const completeMilestone = async () => ({ success: false });

  return {
    grants,
    loading: contextLoading || localLoading,
    error,
    isNGO: userRole === 'NGO',
    isConnected,
    isCorrectNetwork: true,
    transactionStatus,
    createGrant: handleCreateGrant,
    applyForGrant: handleApplyForGrant,
    approveApplication,
    completeMilestone,
    refetchGrants: loadGrants
  };
}
