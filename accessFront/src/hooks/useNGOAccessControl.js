import { useContract } from '../context/ContractContext';

export const useNGOAccessControl = () => {
  const { userRole, isVerified, loading } = useContract();

  return {
    isAuthorized: userRole === 'NGO' || userRole === 'ADMIN',
    isVerified,
    isAdmin: userRole === 'ADMIN',
    userRole,
    grantNGORole: async () => {},
    revokeNGORole: async () => {},
    checkAuthorization: async () => userRole === 'NGO' || userRole === 'ADMIN',
    isLoadingAuthorization: loading
  };
};

