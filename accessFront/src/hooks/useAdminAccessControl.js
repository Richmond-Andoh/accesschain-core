import { useContract } from '../context/ContractContext';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESSES, NGOAccessControlABI } from '../config/contracts';
import { toast } from 'react-toastify';

export const useAdminAccessControl = () => {
    const { userRole, loading } = useContract();
    const { address } = useAccount();

    const isAdmin = userRole === 'ADMIN';

    // Grant Role (Admin functionality)
    const { write: writeGrant, data: grantData } = useContractWrite({
        address: CONTRACT_ADDRESSES.NGOAccessControl,
        abi: NGOAccessControlABI,
        functionName: 'grantRole',
    });

    const { isLoading: isGranting } = useWaitForTransaction({
        hash: grantData?.hash,
        onSuccess: () => {
            toast.success('Role granted successfully!');
        }
    });

    // Revoke Role (Admin functionality)
    const { write: writeRevoke, data: revokeData } = useContractWrite({
        address: CONTRACT_ADDRESSES.NGOAccessControl,
        abi: NGOAccessControlABI,
        functionName: 'revokeRole',
    });

    const { isLoading: isRevoking } = useWaitForTransaction({
        hash: revokeData?.hash,
        onSuccess: () => {
            toast.success('Role revoked successfully!');
        }
    });

    return {
        isAdmin,
        userRole,
        loading: loading || isGranting || isRevoking,
        isOwner: isAdmin, // For now, Admin and Owner are the same initial role
        addNGO: (ngoAddress) => writeGrant({ args: [ngoAddress, 1] }), // 1 = Role.NGO
        revokeNGO: (ngoAddress) => writeRevoke({ args: [ngoAddress] }),
        ngoList: [], // We would need events or a subgraph for a real list
        isCorrectNetwork: true // Handled by global network check usually
    };
};

export default useAdminAccessControl;
